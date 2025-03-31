import React from 'react'
import {io} from "socket.io-client"

function Home(){
    const socket = io("https://chamful.onrender.com")

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