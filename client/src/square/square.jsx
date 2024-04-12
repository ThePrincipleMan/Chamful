import React from 'react'
import SubSquare from './subsquare'
import './square.css'

const square = ({
    content,
    row,
    col,
    tokens,
    setTokens,
}) => {
    let cellcolor = ["neutral","neutral","neutral","neutral"];
    if (row === 0 && col === 2){
        cellcolor = ['redbg', 'redbg', 'redbg', 'redbg']
    }
    else if(row === 2 && col === 0){
        cellcolor = ['greenbg', 'greenbg', 'greenbg', 'greenbg']
    } 
    else if(row === 2 && col === 4){
        cellcolor = ['bluebg', 'bluebg', 'bluebg', 'bluebg']
    }
    else if(row === 4 && col === 2){
        cellcolor = ['yellowbg', 'yellowbg', 'yellowbg', 'yellowbg']
    }
    else if(row === 2 && col === 2){
        cellcolor[0] = 'greenbg'
        cellcolor[1] = 'redbg'
        cellcolor[2] = 'yellowbg'
        cellcolor[3] = 'bluebg'
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