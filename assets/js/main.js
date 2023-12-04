const menu = document.querySelectorAll('.icon-outline');
const user = document.querySelector('.main-pick');
const game = document.querySelector('.main-result');
const you = document.querySelector('.you-picked .icon-outline');
const house = document.querySelector('.house-picked .icon-outline');  
const narrowGame = document.getElementById('game-play-narrow');  
const board = document.getElementById('score-total');
const bestScore = document.querySelector('.best-score');
const score = document.getElementById('score');
const lives = document.getElementById('lives-left');
const resetLives = document.getElementById('reset-lives');
const rules = document.getElementById('rules');
const scoreHelp = document.querySelector('.score-help');

// init score board
let boardScore = 0;

// obj for toggle lives colors
const livesColors = {
    5: 'x5',
    4: 'x4',
    3: 'x3',
    2: 'x2',
    1: 'x1'
}

// obj only with WIN situations
const wins = [
    {human:'rock', computer: 'scissors'},
    {human:'rock', computer: 'lizard'},            

    {human:'paper', computer: 'rock'},            
    {human:'paper', computer: 'spock'},
    
    {human:'scissors', computer: 'paper'},            
    {human:'scissors', computer: 'lizard'}, 
    
    {human:'lizard', computer: 'paper'},             
    {human:'lizard', computer: 'spock'},
    
    {human:'spock', computer: 'rock'},
    {human:'spock', computer: 'scissors'} 
]

// listen to reset button click
resetLives.addEventListener('click', (e)=>{
   // reset lives and best score
   e.target.setAttribute('data-lives', e.target.getAttribute('data-lives') === 'true' ? 'false' : 'true');  
   resetGame('reset game', 'reset-game');   
});

// get local storage current score 
const scoreData = getLocalStorage('score');

// reset the score board 
function resetScore(){    
    // 'true' for the first init of the score board OR if lives === 0 OR if USER click reset button ⟳
    if(scoreData.length === 0 || getLocalStorage('lives') === 0 || resetLives.dataset.lives === 'true'){
        
        getLocalStorage('best-score') < getLocalStorage('score') ? 
        setLocalStorage('best-score', 0) : 
        false;
        
        setLocalStorage('score', 0);
        setLocalStorage('lives', 5); 
        resetColor('5');
        bestScore.innerHTML = getLocalStorage('best-score');   
        board.innerHTML = 0;      
        lives.innerHTML = 5;  
          
    }else{               
        getLocalStorage('best-score') ? 
        bestScore.innerHTML = getLocalStorage('best-score') : 
        bestScore.innerHTML = getLocalStorage('score');
        
        board.innerHTML = getLocalStorage('score');
        lives.innerHTML = getLocalStorage('lives');    
        resetColor(lives.textContent);   
    }
}

// reset the game 
function resetGame(title='game over', id='start-again'){
    const resetContainer = document.querySelector('.reset-container');   
    const resetTitle = document.querySelector('.reset-container h3');
    const startAgain = document.querySelector('#start-again');
    const resetGame = document.querySelector('.reset-game');
    const yesBtn = document.getElementById('yes');
    const noBtn = document.getElementById('no');
    let addEvent;
    
    // show the title of modal window
    resetTitle.textContent = title;

    // show the modal window for start over the game, if lives === 0
    if(id === 'start-again'){
        addEvent = startAgain;
        startAgain.style.display = 'block';
        resetGame.style.display = 'none';
    // show the modal window or resetting the game, if USER click 'reset'
    }else if(id === 'reset-game'){
        addEvent = yesBtn;
        startAgain.style.display = 'none';
        resetGame.style.display = 'block';
    }

    resetContainer.style.display = 'block';

    // listen to reset 'no' button
    noBtn.addEventListener('click', ()=>{
        resetLives.dataset.lives = 'false';
        resetContainer.style.display = 'none';
        game.style.display = 'none';
        user.style.display = 'block';

    })
    // listen to the modals windows, reset 'yes' button and start over 
    addEvent.addEventListener('click',()=>{
        boardScore = 0;        
        setLocalStorage('score', 0);
        resetScore();
        resetContainer.style.display = 'none';
        game.style.display = 'none';
        user.style.display = 'block';
    });
}

// display USER and CPU symbols
function pickSymbol(e){    

    const humanPick = e.target.dataset.icon;
    const computerPick = randomIcon();

    // set the USER pick and CPU in the DOM
    you.dataset.icon = humanPick;
    house.dataset.icon = computerPick;    

    // removing the :hover behavior with the CSS
    you.style.setProperty('pointer-events', 'none');
    house.style.setProperty('pointer-events', 'none');

    // hide the main page and show chosen symbols with the result
    user.style.display = 'none';
    game.style.display = 'block';
    
    // switch to wider layout for final result if the screen is bigger than 974px
    const minWidth = window.innerWidth;
    if(minWidth >= 974){
        narrowGame.classList.remove('game-play-narrow');
        narrowGame.classList.add('game-play-wide');
    }    

    // calculate score and update score board
    calculateScore(humanPick, computerPick);
}

// calculate score
function calculateScore(usrSymbol, cpuSymbol) {
    score.style.display = 'block';
    
    if(usrSymbol){
        // filter the winning symbols from 'wins' obj
        const temArr = wins.filter(win=>win.human === usrSymbol && win.computer === cpuSymbol);       
      
        // if 'win'
        if(temArr.length > 0){
            boardScore++;                
            
            boardScore > getLocalStorage('score') ? setLocalStorage('score', boardScore) : false;            
            
            score.firstElementChild.innerHTML = 'You won';             
            board.innerHTML = boardScore;   

            if(getLocalStorage('score') > getLocalStorage('best-score')){
                setLocalStorage('best-score', boardScore);
                bestScore.textContent = getLocalStorage('score'); 
            }
                   
        // if 'draw'
        }else if(usrSymbol === cpuSymbol){
            score.firstElementChild.innerHTML = 'Draw';
        // if 'lose'
        }else{    
            resetLives.dataset.lives = 'false'; 
            let tempVar = Number(lives.innerHTML) - 1;            
            lives.innerHTML = tempVar;
            setLocalStorage('lives', tempVar);    
            resetColor(tempVar);     
            
            // if 'lives === 0' reset the game 
            if(getLocalStorage('lives') === 0){
                boardScore = 0;
                resetColor('5');
                resetGame();              
            }else{
                score.firstElementChild.innerHTML = 'You lose';
            }
        }
    }
 
    // repeat play 
    document.querySelector('.play-btn').addEventListener('click', ()=>{
        // hide the main page and show chosen symbols with the result
        user.style.display = 'block';
        game.style.display = 'none';
        you.style.setProperty('pointer-events', '');
        house.style.setProperty('pointer-events', '');       
    });
}

// modal windows for rules and score board 
function modalWindow(elem, text, imgClass){
    elem.addEventListener('click', ()=>{
        const modalContainer = document.querySelector('.modal-container');
        const modal = document.getElementById('modal-cancel');
        const title = document.querySelector('.modal-header h3');
        const image = document.getElementById('modal-img');

        // show the title and image, depend of what was clicked
        title.textContent = text;
        image.classList.add(imgClass);

        modalContainer.style.display = 'block';
        
        // hide the modal window
        modal.addEventListener('click', ()=>{
            modalContainer.style.display = 'none';
            image.classList.remove(imgClass);
        })
    })

}

// CPU random symbol
const randomIcon = ()=>{
    const icon = ['rock', 'paper', 'scissors', 'lizard', 'spock']
    return icon[Math.floor((Math.random() * 4) + 1)];
}

// toggle the live colors
function resetColor(color){
    lives.className = '';
    lives.classList.add(`${livesColors[color]}`);
}

// switch from desktop layout to mobile layout and vice versa
window.addEventListener('resize', ()=>{
    let minWidth = window.innerWidth;
    if(minWidth <= 974){        
        narrowGame.classList.remove('game-play-wide');
        narrowGame.classList.add('game-play-narrow');
    }else{
        narrowGame.classList.remove('game-play-narrow');
        narrowGame.classList.add('game-play-wide');
    }    
});

// save to local storage
function setLocalStorage(text, data){
    // convert js data to string and write to local storage
    localStorage.setItem(text, JSON.stringify(data));
}

// get from local storage
function getLocalStorage(text){
    // parse the data to use in js
    const data = JSON.parse(localStorage.getItem(text));
    return data === null ? [] : data;
}

// loop through all symbols and listen to USER click
Array.from(menu).forEach(item => {
    item.addEventListener('click', pickSymbol);        
});

modalWindow(rules, 'rules', 'modal-rules');
modalWindow(scoreHelp, 'score board', 'modal-help');

// create init value in local storage 
resetScore();