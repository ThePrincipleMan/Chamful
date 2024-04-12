import React, { useState, useEffect } from 'react'
import Square from '../square/square'
import '../components/styles.css'
import Swal from 'sweetalert2'
import { io } from 'socket.io-client'
import { colorArray } from '../clientsidedata.js'

const boardform = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

let tokenPosition = []
for (let i = 0; i < 5; i += 1) {
    let tmparr = []
    for (let j = 0; j < 5; j += 1) {
        let tmpdict = {}
        tmpdict["yellow"] = []
        tmpdict["red"] = []
        tmpdict["green"] = []
        tmpdict["blue"] = []
        // this part temperory for debugging easyness
        // if (i === 4 && j === 2){
        //     tmpdict["yellow"] = [1, 1, 1, 1]
        //     tmpdict["green"] = [1, 1, 1, 1]
        //     tmpdict["blue"] = [1, 1, 1, 1]
        //     tmpdict["red"] = [1, 1, 1, 1]
        // }
        // else if (i === 2 && j === 0)
        //     tmpdict["green"] = [1, 1, 1, 1]
        // else if (i === 2 && j === 4)
        //     tmpdict["blue"] = [1, 1, 1, 1]
        // else if (i === 0 && j === 2)
        //     tmpdict["red"] = [1, 1, 1, 1]
        // till here
        tmparr.push(tmpdict)
    }
    tokenPosition.push(tmparr)
}

const dieValues = [1, 2, 3, 1, 2, 3, 4, 8]

const socket = io.connect("http://localhost:3001")



// tokenPosition[0][2]['yellow'].push(1)
// tokenPosition[3][0]['red'].push(1)

function PlayScreen() {
    const [gameState, setGameState] = useState(boardform)
    const [tokens, setTokens] = useState(tokenPosition)
    const [userName, setUserName] = useState("")
    const [gamecode, setGamecode] = useState(0)
    const [room, setRoom] = useState()
    const [turn, setTurn] = useState(0)
    const [turncnt, setTurncnt] = useState(0)
    const [die, setDie] = useState(0)
    const [zero, setZero] = useState("s")
    const [one, setOne] = useState("s")
    const [two, setTwo] = useState("s")
    const [three, setThree] = useState("s")
    const [firstBlood, setFirstBlood] = useState([false,false,false,false])
    //const socket = io("http://localhost:3001")
    //const [socket, setSocket] = useState(io.connect("http://localhost:3001"))

    const [userColor, setUserColor] = useState()
    const [rolled, setRolled] = useState(false)

    useEffect(() => {
        socket.on('gameCode', gameCode => {
            console.log(gameCode)
            setGamecode(gameCode)
            // do something to display this to user
        })

        socket.on('init', data => {
            setUserColor(data.color)
        })

        socket.on('startGame', data => {
            //console.log(userColor)
            setTokens(data.tokenpos)
            setTurn(data.turn)
            setZero(data.zero)
            setOne(data.one)
            setTwo(data.two)
            setThree(data.three)
            setTurncnt(data.turncnt)
        })

        socket.on('updateDie', data => {
            setDie(data.die)
            // console.log(data.die)  // value of die not updating
            // console.log(die)      // quick enough therefore displaying outdated value in die
            setRolled(true)
            setTurn(data.turn)
            setTurncnt(data.turncnt)
        })

        socket.on('updateGame', data => {
            setTokens(data.newgameState)
            setRolled(false)
            setDie(0)
            setTurn(data.nextturn)
            setTurncnt(data.turncnt)
            setFirstBlood(data.fblood)
            console.log(firstBlood)
        })

        socket.on('endGame', data => {
            if(userColor === data.winner){
                Swal.fire({
                    title: "You Have Won the Game!!",
                    text: "Congratulations, you have won the game",
                    icon: "success"
                })
            }
            else{
                Swal.fire({
                    title: "better luck next time",
                    text: 'Someone else won this game',
                })
            }
        })

        return () => {
            socket.off('gameCode')
            socket.off('init')
            socket.off('startGame')
            socket.off('updateDie')
            socket.off('updateGame')
            socket.off('endgame')
        }
    }, [])

    // useEffect(() => {
    //     console.log('die change detected')
    //     console.log(die)
    // }, [die])   
    // working in order

    function createRoom() {
        console.log('flag1')
        socket.emit('newGame', userName)
        console.log("flag2")
        document.getElementById('joinwindow').style.display = "none"
        document.getElementById('gamescreen').style.display = "flex"
    }

    function joinRoom() {
        const data = {
            uname: userName,
            roomid: parseInt(room),
        }
        console.log('flag3')
        socket.emit('joinGame', data)
        console.log('flag4')
        // here do if else statement for when the input game code is incorrect
        document.getElementById('joinwindow').style.display = "none"
        document.getElementById('gamescreen').style.display = "flex"
    }

    function rollDie() {
        console.log('rollDie')
        console.log(userColor)
        console.log(turn)
        if (turn === userColor && rolled === false) {
            const idx = Math.floor((Math.random() * 8))
            setRolled(true)
            //setDie(dieValues[die])
            socket.emit('rollDie', { idx: idx, turn: turn, })
        }
    }

    function handleMove(row, col) {
        //console.log(tokenPosition[row][col]['yellow'])
        console.log('rolled')
        console.log(rolled)
        if(row === 2 && col === 2)
            return;
        if (turn === userColor && rolled && Object.keys(tokens[row][col][colorArray[userColor]]).length > 0) {
            //console.log('inside handlemove')
            const data = {
                col: col,
                row: row,
            }
            console.log('inside if')
            socket.emit('userPlay', data)
        }
    }

    return (
        <div id="playscreenpage">
            <div id='joinwindow'>
                <div id="joinoption">
                    <h2>Welcome to Chamful!</h2>
                    <div className='optionwrapper'>
                        <div className='button' onClick={() => {
                            document.getElementById('joinoption').style.display = "none"
                            document.getElementById('createroom').style.display = "flex"
                        }}>Create new game</div>
                        <div className='button' onClick={() => {
                            document.getElementById('joinoption').style.display = "none"
                            document.getElementById('joinroom').style.display = "flex"
                        }}>Join an existing game</div>
                    </div>
                </div>
                <div id="createroom">
                    <h3>What name do you wish to take?</h3>
                    <input
                        type="text"
                        placeholder='UserName'
                        name='name'
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                    <div className="button" onClick={createRoom}>Create</div>

                </div>
                <div id="joinroom">
                    <h3>Input your username and room code carefullly</h3>
                    <form className='joinroomform'>
                        <input
                            type="text"
                            placeholder='UserName'
                            name='name'
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value)
                            }}
                        />
                        <input
                            type="text"
                            placeholder='room'
                            name='room'
                            value={room}
                            onChange={(e) => {
                                setRoom(e.target.value)
                            }}
                        />
                        <div className='button' onClick={joinRoom}>Join</div>
                    </form>
                </div>
            </div>

            <div id='gamescreen'>
                <div className='leftscreen'>
                    <div className='gamecode'>GameCode - {gamecode}</div>
                    <div className='playerlist'>
                        <div className='yellow'>
                            {zero}
                        </div>
                        <div className='green'>{one}{firstBlood[1]}</div>
                        <div className='red'>{two}{firstBlood[2]}</div>
                        <div className='blue'>{three}{firstBlood[3]}</div>
                    </div>
                </div>
                <div className='middlescreen'>
                    <div className='board'>
                        <div className='square-wrapper'>
                            {gameState.map((arr, rowIndex) =>
                                arr.map((e, colIndex) => {
                                    return (
                                        <div onClick={() => handleMove(rowIndex, colIndex)}>
                                            <Square
                                                content={e}
                                                row={rowIndex}
                                                col={colIndex}
                                                tokens={tokens}
                                                setTokens={setTokens}
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className='rightscreen'>
                    <div id='dice'>
                        <div>{die}</div>
                        <div className="rollbtn" onClick={rollDie}>Roll</div>
                        <div>
                            <div>Turn</div>
                            <div className={`${colorArray[turn]}`}>{colorArray[turn]}</div>
                        </div>
                        <div>
                            <div>You Are</div>
                            <div className={`${colorArray[userColor]}`}>{colorArray[userColor]}</div>
                        </div>
                        <div>
                            <div>Rolls remaining</div>
                            <div>{turncnt}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayScreen