const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser= require('body-parser');
let drawModel=require('./models/drawing');
const passport=require('passport');
var cookieSession= require('cookie-session');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const app = express();
// app.use(require('cors')())
const server = http.createServer(app);
const io= socketio(server);
// const io = socketio(server, {
//   cors: {
//       origin: "https://limitless-cove-86738.herokuapp.com/",
//       methods: ["GET", "POST"],
//       transports: ['websocket', 'polling'],
//       credentials: true
//   },
//   allowEIO3: true
// });
//database
var mongoose=require('mongoose');
const db = require('./config/keys').mongoURI;
mongoose
  .connect( db,{ useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
require('./passport');
app.use('/peerjs', peerServer);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieSession({
  name:'tuto-session',
  keys:['key1','key2']
}));

const isLoggedIn= (req,res,next)=>{
  if(req.user)
  next()
  else res.redirect('/auth/google');
}
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',isLoggedIn, (req, res) => {
  //console.log(req.user.displayName);
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  //console.log(req.user.photos);
  res.render('room', { roomId: req.params.room, username:req.user.displayName,photo:req.user.photos[0].value})
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',(req,res)=>{
  req.session=null;
  req.logout();
  res.redirect('/login');
})

io.on('connection', socket => {
  socket.on('joinRoom', ( username,photo, room ,userId) => {
  
    socket.join(room);
    const user = userJoin(socket.id, username, photo, room, userId);
    
    // Welcome current user
     socket.emit('welcome','Welcome to ChatCord!');
     // Broadcast when a user connects
     socket.broadcast
    .to(room)
    .emit('user-connected',userId);
    // Send users and room info
   
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  
  }); //join room ended
  
  // messages
  socket.on('message', (room,message) => {
        //send message to the same room
        const user = getCurrentUser(socket.id);
        io.to(room).emit('createMessage', user.username,message,user.photo);
  }); 
  socket.on('drawing', (canvasJson,room) => {
    io.to(room).emit('drawing', canvasJson);
  });
  socket.on('savedb', function(canvasJson, frameId, room) {
    console.log("saving to db");
    console.log(frameId);
    console.log(room);
    var myJSONstring = JSON.stringify(canvasJson);
     //var obj = JSON.parse(myJSONstring);

     drawModel
     .findOneAndUpdate(
    {
      frame:frameId,
      room:room
    }, 
    {
      frame:frameId,
      data:myJSONstring,
      room:room
    },
    {
      new: true,                       // return updated doc
      upsert: true              // validate before update
    })
  .then(doc => {
    console.log("data saved")
    
  })
  .catch(err => {
    console.error(err)
  });

 });
 socket.on('showdb', function(room,frameId) {
   console.log("show"+frameId);
  drawModel
  .find({
    room:room,
    frame:frameId
   
  })
  .then(doc => {
    //console.log(doc);
    var myJSONstring= doc[0].data;
    var obj = JSON.parse(myJSONstring);
    //console.log(obj);
    io.to(room).emit('drawing', obj);
    
  })
  .catch(err => {
    console.error(err)
  });
});
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'user-disconnected',
         `${user.username}  has left the chat`,user.peerid
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
  
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

