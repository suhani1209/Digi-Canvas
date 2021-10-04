# Node JS Zoom Clone

## Usage
```
npm install
npm start

Go to localhost:3030
```
## Tutorial
# to make server with express
```js
npm install express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
```

# include ejs
```js
npm install ejs
app.set('view engine', 'ejs');
```
# include static folder
app.use(express.static('public'))

as a user connects we want to generate a random id and redirect user to that new url

**generate random ids**
```js
const {v4:uuidv4} = require('uuid');
app.get('/',(req,res)=>{
  res.redirect(`/${uuidv4()}`);
})
app.get('/:room',(req,res)=>{
  res.render('room',{roomId:req.params.room})
})
```
# adding my video
```js
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
}
```
```js
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
```

# include socket.io in your project
first of all user will connect and peer id will be generated and send a join-room event to the server along with roomid and userid. The server will receive this event and broadcast to other users that this user has join in this room with this user id. when user will disconnect it will send a disconnect event from script.js to the server and server will receive this event and broadcast to others.
inside server file

# making a peer js server

in roome.js include script files 
<script defer src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
<script src="/socket.io/socket.io.js" defer></script>

in server.js
```js
npm install peer
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use('/peerjs', peerServer);
```
in script.js

```js
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
const peers = {}
myPeer.on('open', id => {
  //just as peer generates the id socket should tell the server join-room with this RIoom id and peerid
  socket.emit('join-room', ROOM_ID, id)
})
```


# socket.io 
```js
npm install socket.io
const server= require('http').Server(app);
const io= require('socket.io')(server);
io.on('connection',socket=>{
  socket.on('join-room',(roomId)=>{
    socket.join(roomId);
    //broadcast to other that this user has joined
    socket.to(roomId).broadcast.emit('user-connected', userId);
  }
}
```

# media calls
when the other person connects it will make a peer call to me ans send his stream. I have to add his video to the video grid and ans to his call and send my stream which the other person will get and add to his videogrid

```js
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  //just as other user connects,  server tells the client 
   socket.on('user-connected', userId => {
  //new user is making call
    connectToNewUser(userId, stream)
  })
  // answering the call send by the other user
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

});
```

```js
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}
```


