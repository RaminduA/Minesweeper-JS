import Cell from "./Cell.js"

export const GRID_SIZE=20;
const GRID_PADDING=2;
const CELL_GAP=.3;
const MAX_CELL_SIZE=200;
const CELL_SIZE=Math.min(MAX_CELL_SIZE, (100 - (GRID_SIZE-1)*CELL_GAP - 2*GRID_PADDING)/GRID_SIZE);

export class Grid {
    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size",GRID_SIZE);
        gridElement.style.setProperty("--grid-padding",`${GRID_PADDING}vmin`);
        gridElement.style.setProperty("--cell-size",`${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap",`${CELL_GAP}vmin`);
        this.cells = createCellElements(gridElement).map((cellElement,index)=>{
            return new Cell(
                cellElement,
                index % GRID_SIZE,
                Math.floor(index / GRID_SIZE));
        });
    }
}

function createCellElements(gridElement){
    const cells=[];
    for(let i=0; i<GRID_SIZE*GRID_SIZE; i++){
        const cell=document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}
