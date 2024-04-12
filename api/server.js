import express from "express"
import cors from "cors"
import { createServer } from "http"
import { Server } from 'socket.io'
import { initializeGame , playerMove } from './game.js'
import { colorArray, dieValues } from './data.js'

const app = express()
//app.use(cors())
app.use(express.json())

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
    },
}) 

let Rooms = {}
let clienttoRoom = {}
let gameState = {} 
let dieState = {}  
let turn = {}
let firstBlood = {}
let turnCount = {}

io.on("connection", client => {
    console.log("New connection formed")
    console.log(client.id)

    client.on('newGame', userName => {
        let roomName = Math.floor((Math.random() * 9999) + 1000)
        while (roomName in Rooms) {
            roomName = Math.floor((Math.random() * 9999) + 1000) 
        }
        clienttoRoom[client.id] = roomName 
        const clientinfo = {
            name: userName,
            cliendid: client.id,
            color: 0,
        }
        Rooms[roomName] = {}
        Rooms[roomName][0] = clientinfo
        turn[roomName] = 0
        turnCount[roomName] = [1,0,0,0]
        dieState[roomName] = 0
        firstBlood[roomName] = [false,false,false,false]
        client.join(roomName)
        console.log('bflag1')
        console.log(Rooms[roomName])
        client.emit('gameCode', roomName)

        gameState[roomName] = initializeGame()


        //client.number = 1
        const data = {
            color: 0,
        }
        client.emit('init', data)
        // temperory addition for debugging remove in production
        // const startdata = {
        //     tokenpos: gameState[roomName],
        //     //turn: Rooms[roomName][0].color,
        //     turn: 0,
        // }
        // console.log('bflag8')
        // io.sockets.in(roomName).emit('startGame', startdata)
        // till here
    })

    client.on('joinGame', data => {
        const roomName = data.roomid
        const userName = data.uname 

        if(roomName in Rooms === false){
            client.emit('invalidCode')
            return
        }
        const players = Object.keys(Rooms[roomName]).length

        if (players === 4) {
            client.emit('tooManyPlayers')
            return
        }

        clienttoRoom[client.id] = roomName
        client.join(roomName)
        client.emit('gameCode', roomName)
        const clientinfo = {
            name: userName,
            cliendid: client.id,  
            color: players,
            //die: dieState[roomName],
        }
        
        Rooms[roomName][players] = clientinfo
        //console.log(Rooms[roomName][players].color)
        
        const initialdata = {
            color: Rooms[roomName][players].color,
        }
        client.emit('init', initialdata)
        
        if(Object.keys(Rooms[roomName]).length == 4){
            const startdata = {
                tokenpos: gameState[roomName],
                turn: Rooms[roomName][0].color,
                turncnt: turnCount[roomName][0],
                zero: Rooms[roomName][0].name,
                one: Rooms[roomName][1].name,
                two: Rooms[roomName][2].name,
                three: Rooms[roomName][3].name,
            }
            console.log('bflag8')
            io.sockets.in(roomName).emit('startGame', startdata)
        }
    })

    client.on('rollDie', data => {
        const roomName = clienttoRoom[client.id]
        dieState[roomName] = dieValues[data.idx]
        turnCount[roomName][data.turn] -= 1
        if(dieValues[data.idx] === 4 || dieValues[data.idx] === 8){
            turnCount[roomName][data.turn] += 1
        } 
        //console.log('inside rolldie')
        const rdata = {
            die: dieValues[data.idx],
            //turn: (data.turn + 1)%4,
            turn: data.turn,  // dont update turn just now
            turncnt: turnCount[roomName][data.turn]
        }
        io.sockets.to(roomName).emit('updateDie', rdata)
    })

    client.on('userPlay', data => {
        const roomName = clienttoRoom[client.id]
        const die = dieState[roomName]
        const player = turn[roomName]
        const fblood = firstBlood[roomName]
        const currentState = gameState[roomName]
        // if(Object.keys(gameState[roomName][data.row][data.col][colorArray[player]]).length === 0)
        //     return
        let result = playerMove(data.row, data.col, die, player, currentState, fblood) 
        const newgameState = result.tokenpos
        if(Object.keys(newgameState[2][2][colorArray[player]]) === 4){
            const ndata = {
                winner: player,
            }
            io.sockets.to(roomName).emit('endGame', ndata)
            return
        }
        if(result.killsome){
            turnCount[roomName][turn[roomName]] += 1
        }
        firstBlood[roomName] = result.firstblood
        
        let nextturn = player
        if(turnCount[roomName][turn[roomName]] == 0){
            nextturn = (nextturn+1)%4
            turnCount[roomName][nextturn] = 1
        }
        turn[roomName] = nextturn
        
        const rdata = {
            newgameState: newgameState,
            nextturn: nextturn,
            turncnt: turnCount[roomName][turn[roomName]],
            fblood: firstBlood[roomName],
        }
        io.sockets.to(roomName).emit('updateGame', rdata)
    }) 

})

httpServer.listen(3001) 
 

// app.listen(3001, () => {
//     console.log("Server is running on port 3001")
// })