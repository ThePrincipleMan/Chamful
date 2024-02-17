import { colorArray } from "./data.js"

export default {
    initializeGame,
}

const home = [[4,2],[2,0],[0,2],[2,4]]

const gateway = [[4,1],[1,0],[0,3],[3,4]]
const innerCell = [[3,1],[1,1],[1,3],[3,3]]              //represents inner cell token will enter in on going through gateway
const finalCell = [[3,2],[2,1],[1,2],[2,3]]   // sort of like antim pag for tokens

const innerRing = [[]]

export function initializeGame() {
    let tokenPosition = []
    for (let i = 0; i < 5; i += 1) {
        let tmparr = []
        for (let j = 0; j < 5; j += 1) {
            let tmpdict = {}
            tmpdict["yellow"] = []
            tmpdict["red"] = []
            tmpdict["green"] = []
            tmpdict["blue"] = []
            if (i === 4 && j === 2)
                tmpdict["yellow"] = [1, 1, 1, 1]
            else if (i === 2 && j === 0)
                tmpdict["green"] = [1, 1, 1, 1]
            else if (i === 2 && j === 4)
                tmpdict["blue"] = [1, 1, 1, 1]
            else if (i === 0 && j === 2)
                tmpdict["red"] = [1, 1, 1, 1]
            tmparr.push(tmpdict)
        }
        tokenPosition.push(tmparr)
    }
    return tokenPosition
}

function next(row,col,turn,firstBlood){
    if(row === gateway[turn][0] && col === gateway[turn][1] && firstBlood[turn]){
        return innerCell[turn]     //handling innercell entry
    }
    if(row === finalCell[turn][0] && col === finalCell[turn][1]){
        // means we have reached the end
    }
    if(row === 4 || row === 0 || col === 4 || col === 0){
        // we in outer ring
        if(col === 0){
            if(row !== 4){
                return [row+1,col]
            }
            else{
                return [row,col+1]
            }
        }
        else if(row === 4){
            if(col !== 4){
                return [row,col+1]
            }
            else{
                return [row-1,col]
            }
        }
        else if(col === 4){
            if(row !== 0){
                return [row-1,col]
            }
            else{
                return [row,col-1]
            }
        }
        else if(row === 0){
            return [row,col-1]
        }
    }
    else{
        // we in inner ring
        if(col === 1){
            if(row !== 1){
                return [row-1,col]
            }
            else{
                return [row,col+1]
            }
        }
        else if(row === 1){
            if(col !== 3){
                return [row,col+1]
            }
            else{
                return [row+1,col]
            }
        }
        else if(col === 3){
            if(row !== 3){
                return [row+1,col]
            }
            else{
                return [row,col-1]
            }
        }
        else if(row === 3){
            if(col !== 1){
                return [row,col-1]
            }
            else{
                return [row-1,col]
            }
        }
    }
}

export function playerMove(row,col,die,turn,tokenpos,firstBlood){
    let nexrow = row,nexcol = col
    while(die){
        die -= 1
        let temp = next(nexrow, nexcol,turn,firstBlood)
        nexrow = temp[0]
        nexcol = temp[1]
    } 
    tokenpos[row][col][colorArray[turn]].pop()
    tokenpos[nexrow][nexcol][colorArray[turn]].push(1)

    // handle killing of comrads
    for(let i = 0; i<4; i++){
        if(i === turn)
            continue
        let ln = Object.keys(tokenpos[nexrow][nexcol][colorArray[i]]).length
        while(ln){
            ln -= 1
            firstBlood[i] = true
            tokenpos[nexrow][nexcol][colorArray[i]].pop()
            tokenpos[home[i][0]][home[i][1]][colorArray[i]].push(1)
        }
    }
    return tokenpos
}