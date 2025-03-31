# Chamful : An Indian Ludo

## Introduction
Chamful is a popular board game played predominantly in Maharashtra under various different name. I created this project to learn WebSockets while also being able to play the game with my family, wherever we may be.

## Overview

### Frontend
The frontend for the project is created using **reactjs** framework for quick and easy set up of an inital working frontend prototype. Coding of many functional aspects were also helped immensly due to functionality of react, for example - 
- Concept of *state* in react proved useful in storing current state of the board and dice value locally
- React grid helped hugely to create the actual board of Chamful
  
### Backend
Backend is powered by **Node.js** along with WebSockets using **socket.io** being used for its near realtime response. Various different functions are implemented for various different steps associated with the game, called mainly using websockets *.on* functionality.
- The game logic is coded into *server.js* file using javascript, along with other ancillary files like *game.js* and *data.js*
- Socket.io's *.on* and *.emit* used to facilitate communication between frontend and backend
- *.join* used to connect clients of a single **room** (i.e. 4 players of a game instance) together 

## Website Link
Backend hosted on render.com  
Frontend hosted on netlify.com  
Link - https://chamful.netlify.app/  
*note that the backend may take upto a couple of minutes to activate and be able to process your requests
