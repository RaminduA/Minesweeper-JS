import {Grid,GRID_SIZE} from "./Grid.js"


const BOMB_PERCENTAGE=.08;
const BOMB_COUNT=Math.floor(GRID_SIZE * GRID_SIZE* BOMB_PERCENTAGE);

const gameBoard=document.getElementById("game-board");

export const grid=new Grid(gameBoard);


grid.cells.forEach(cell=>{
    cell.cellElement.onclick=function(e){handleClick(e,cell)}
});

for(let i=0; i<BOMB_COUNT; i++){
    let b=false;
    while(!b){
        let cell=getRandomCell();
        b=deployBomb(cell);
    }
}

grid.cells.forEach(cell=>{
    let cellsAround=getCellsAround(cell.x,cell.y);
    searchForBombs(cell.cellElement,cellsAround);
});

function handleClick(e,cell) {
    let cellElement=cell.cellElement;
    if(cellElement.classList.contains('x')){
        detonateAllBombs();
        disableAllCells();
        showWinningMessage(false);
    }else if(cellElement.classList.contains('o')){
        cellElement.classList.add("safe");
        revealSurroundings(cell);
    }else if(cellElement.classList.contains('i')){
        cellElement.classList.add("near");
        cellElement.innerText=cellElement.style.getPropertyValue("--count");
    }
    cellElement.onclick=null;
    if(checkWin()){
        disableAllCells();
        defuseAllBombs();
        showWinningMessage(true);
    }
}

function defuseAllBombs(){
    setTimeout(()=> {
        document.querySelectorAll(".x").forEach(bombCell => {
            bombCell.classList.add("defuse");
            bombCell.innerText = "💣";
        });
    },1000);
}

function checkWin(){
    let count=0;
    grid.cells.forEach(cell=>{
        let classList=cell.cellElement.classList;
        if(classList.contains("near") || classList.contains("safe")){
            count++;
        }
    });
    return (GRID_SIZE*GRID_SIZE - count)===BOMB_COUNT;
}

function showWinningMessage(isWin){
    setTimeout(()=>{
        let winningMessage=document.querySelector("#winning-message");
        winningMessage.classList.add('show');
        const messageText=document.querySelector(".message-text");
        const restartButton=document.querySelector(".restart-button");
        restartButton.onclick=function () {
            window.location.reload();
        }
        if(isWin){
            messageText.innerHTML="YOU WON...!!!";
        }else{
            messageText.innerHTML="YOU LOST...!!!";
        }
    },2500);
}

function revealSurroundings(c){
    let surroundings=getCellsAround(c.x,c.y);
    surroundings.forEach(cell=>{
        let classList=cell.cellElement.classList;
        if(!classList.contains("near") || !classList.contains("safe")){
            cell.cellElement.click();
        }
    });
}

function searchForBombs(cellElement,cellsAround){
    if(!cellElement.classList.contains("x")){
        let count=0;
        cellsAround.forEach(cell=>{
           if(cell.cellElement.classList.contains("x")){
               count++;
           }
        });
        if(count===0){
            cellElement.classList.add("o");
        }else{
            cellElement.classList.add("i");
            cellElement.style.setProperty("--count",count);
        }
    }
}

function getCellsAround(x,y){
    const cellsAround=[];
    grid.cells.forEach(cell=>{
        if(cell.x===x-1){
            if(cell.y===y-1){
                cellsAround.push(cell);
            }else if(cell.y===y){
                cellsAround.push(cell);
            }else if(cell.y===y+1){
                cellsAround.push(cell);
            }
        }else if(cell.x===x){
            if(cell.y===y-1){
                cellsAround.push(cell);
            }else if(cell.y===y+1){
                cellsAround.push(cell);
            }
        }else if(cell.x===x+1){
            if(cell.y===y-1){
                cellsAround.push(cell);
            }else if(cell.y===y){
                cellsAround.push(cell);
            }else if(cell.y===y+1){
                cellsAround.push(cell);
            }
        }
    });
    return cellsAround;
}


function detonateAllBombs(){
    const bombCells=document.querySelectorAll(".x");
    for(let i=0; i<bombCells.length; i++){
        bombCells[i].classList.add("bomb");
    }
}

function disableAllCells() {
    const cells=document.querySelectorAll(".cell");
    for(let i=0; i<cells.length; i++){
        cells[i].onclick=null;
    }
}

function getRandomCell(){
    const cellList=document.querySelectorAll(".cell");
    while(true){
        let index=Math.floor(Math.random()*GRID_SIZE*GRID_SIZE);
        if(!cellList[index].classList.contains('x')){
            return cellList[index];
        }
    }
}

function deployBomb(cell){
    cell.classList.add("x");
    return cell.classList.contains('x');
}