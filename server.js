const express = require("express");
const app = express();
const http = require('http').createServer(app)
const io = require("socket.io")(http)
const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


//socket
const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("new user ", name);

        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name)
        console.log("connected");
    })
    //  console.log("connected");
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] } , 'right')

    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
        console.log("disconnected");
    });



})

http.listen(port, () => {
    console.log(`server is running at ${port}`)
})