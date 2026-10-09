const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 同じ場所にある index.html を画面として表示する
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('ユーザーが接続しました:', socket.id);

  // チャットメッセージを受信したら全員に送る
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  // 「既読」信号を受け取ったら全員に送る
  socket.on('mark read', (msgId) => {
    io.emit('mark read', msgId);
  });
});

// Renderが自動で割り当てるポート番号を使う
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});