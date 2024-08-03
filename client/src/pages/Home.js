import React from 'react'
import {io} from "socket.io-client"

function Home(){
    const socket = io.connect("https://chamful.onrender.com", {'timeout':500000000, 'connect timeout': 500000000})

  return (
    <>
        <div>
            <h2>Welcome to Chamful</h2>
            <div>
                <div>
                    <button>Create new game</button>
                </div>
                <div>
                    <button>Join an existing game</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default Home
