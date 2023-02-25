const express = require('express')
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    console.log(`User Connected ID: ${socket.id}`)


    socket.on("join_room", roomName => {
        socket.join(roomName)
        console.log(`User with ID: ${socket.id} joined room: ${roomName}`)
    })

    socket.on("send_message", data => {
        //console.log(data)
        socket.to(data.room).emit("receive_message", data)
    })

    io.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`)
    })
})

server.listen(5000, () => console.log(`Server running on port 5000`))