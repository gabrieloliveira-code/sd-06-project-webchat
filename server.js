const app = require('express')();
const http = require('http').createServer(app);
const dateFormat = require('dateformat');

const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const { indexOf } = require('lodash');
const Messages = require('./models/messageModel');

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const currDate = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');

const allUsers = [];

io.on('connection', (socket) => {
  socket.on('userLogin', async (nickname) => {
    allUsers.push({ id: socket.id, nickname });
    io.emit('users', allUsers);
    const allMsgs = await Messages.getAll();
    allMsgs.forEach((msg) => {
      socket.emit('message', `${msg.timestamp} ${msg.nickname}: ${msg.message}`);
    });
  });
  
  socket.on('disconnect', () => { 
    allUsers.splice(indexOf(socket.id), 1); 
  });
  
  socket.on('message', async ({ chatMessage, nickname }) => {
    const dbMsg = await Messages.create(chatMessage, nickname, currDate);
    io.emit('message', `${dbMsg.timestamp} ${dbMsg.nickname}: ${dbMsg.message}`);
  });
  socket.on('users', async (user) => { io.emit('users', user); });
});

http.listen(3000);