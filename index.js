// Node server which will handle socket io connections();


const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// appending users here
users={}

//server and socket intialization

var http = require('http').createServer(app);
const socket = require('socket.io')
const server = app.listen(port, ()=>{
  console.log(`Listening on http://localhost:${port} `);
});

const io = socket(server);


// Express specific stuff
app.use('/static', express.static('static'));   // for serving static files
app.use(express.urlencoded());

//html specific stuff
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'))  //set the views directory

//Endpoints
app.get('/', (req,res)=>{
    
  const params={};
  res.status(200).render('index.html', params);


});




// socket connection to client side socket
io.on('connection', socket => {
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });


});

