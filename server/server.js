const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatCord Bot';

io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    socket.broadcast.to(user.room).emit('message',
      formatMessage(botName, `${user.username} has joined the chat`)
    );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });

  socket.on('eventStart', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('eventStartTrigger', formatMessage(user.username, msg));
  });

  socket.on('drawBall', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('displayDraw', formatMessage(user.username, msg));
  });

  socket.on('drawAllBall', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('displayAllDraw', formatMessage(user.username, msg));
  });

  socket.on('getPattern', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('setWinningPattern', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      console.log(user.username + " has left the chat")

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });


});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
