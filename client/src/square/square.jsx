import React from 'react'
import SubSquare from './subsquare'
import './square.css'
import Token from '../tokens/token'

const square = ({
    content,
    row,
    col,
    tokens,
    setTokens,
}) => {
    let cellcolor = ["neutral","neutral","neutral","neutral"];
    if (row === 0 && col === 2){
        cellcolor = ['red', 'red', 'red', 'red']
    }
    else if(row === 2 && col === 0){
        cellcolor = ['green', 'green', 'green', 'green']
    } 
    else if(row === 2 && col === 4){
        cellcolor = ['blue', 'blue', 'blue', 'blue']
    }
    else if(row === 4 && col === 2){
        cellcolor = ['yellow', 'yellow', 'yellow', 'yellow']
    }
    else if(row === 2 && col === 2){
        cellcolor[0] = 'green'
        cellcolor[1] = 'red'
        cellcolor[2] = 'yellow'
        cellcolor[3] = 'blue'
    }
    
    return (
        <>
            <div className={`square`}>
                <SubSquare
                    color={cellcolor[0]}
                    token={tokens[row][col]["green"]}
                    tokencolor={"green"}
                />
                <SubSquare
                    color={cellcolor[1]}
                    token={tokens[row][col]["red"]}
                    tokencolor={"red"}
                />
                <SubSquare
                    color={cellcolor[2]}
                    token={tokens[row][col]["yellow"]}
                    tokencolor={"yellow"}
                />
                <SubSquare
                    color={cellcolor[3]}
                    token={tokens[row][col]["blue"]}
                    tokencolor={"blue"}
                />
            </div>
        </>
    )
}

export default square