const socket = io();

/* safe zone */

// Message from server
socket.on('welcome', message => {
    console.log(message);
  });

  // Get room and users
socket.on('roomUsers', ({ room, users }) => {
  //outputRoomName(room);
  outputUsers(users);
  //console.log(room);
  // users.forEach(user=>{
  //     console.log(user.username);
  // });
});
function leavemeeting()
{
  //console.log("leave in js");
}
// const userList = document.getElementById('users');
// // Add users to DOM
 function outputUsers(users) {
  
  var part="";
  users.forEach(user=>{
    part +=`<li class="list-group-item " style="background-color:#1C1E20;color:white;border-bottom: 1px solid white;"><div class="row"><div class="col-2"><img src="${user.photo}" style="width:30px;height:30px;border-radius:50%;"></div><div class="col-10">${user.username}</div></li>`;
  });
  
  $("#participants").html(part);
 }
  /* try zone */
   const videoGrid = document.getElementById('video-grid')
  const myPeer = new Peer();
  // const myPeer = new Peer(undefined, {
  //   path: '/peerjs',
  //   host: '/',
  //   port: '443'
  // });
 
  myPeer.on('open', id => {
    //console.log("peer on event and join-room event emitted");
    socket.emit('joinRoom', userName,photo,ROOM_ID, id)
  })
  let myVideoStream;
  const myVideo = document.createElement('audio')
  myVideo.muted = true;
  const peers = {}
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('audio')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })
  
    socket.on('user-connected', userId => {
      //console.log("a new user has joined chat");
      connectToNewUser(userId, stream)
    })
    // input value
    let text = $("#chat_message");
    // when press enter send message
    $('html').keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message',ROOM_ID, text.val());
        text.val('')
      }
    });
    socket.on("createMessage", (username,message,photo) => {
      $("#chat").append(`<li class="list-group-item" style="background-color:#1C1E20;color:white;border-bottom: 1px solid white;"><div class="row"><div class="col-2"><img src="${photo}" class="align-middle" style="width:30px;height:30px;border-radius:50%;margin:auto"></div><div class="col-10"><b>${username}</b><br/>${message}</div></div></li>`);
      scrollToBottom()
    })
  })
  
  socket.on('user-disconnected', (msg,userId) => {
    //console.log(msg);
    //console.log(userId);
    if (peers[userId])
     peers[userId].close()
     else console.log("peer userid not found");
  })
  
  
  
  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('audio')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
  }
  
  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
  
  
  
  const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  const showchat=()=>{
    if( $("#chatwrapper").css("display")=="block")
    {
      console.log("chat already visible");
      $("#canvasWrapper").removeClass("col-9");
      $("#canvasWrapper").addClass("col");
      $("#participantwrapper").css("display", "none");
      $("#chatwrapper").css("display", "none");
    }
    else 
    {
    $("#canvasWrapper").removeClass("col");
    $("#canvasWrapper").addClass("col-9");
    $("#participantwrapper").css("display", "none");
    $("#chatwrapper").css("display", "block");
    }
      w = div.width();
      h = div.height();
      //console.log(w);
      //console.log(h);
      $canvas.width(w).height(h);
  
  //set w & h for canvas
  canvas.setHeight(h);
  canvas.setWidth(w);
   
  }
  const showparticipants=()=>{
    if( $("#participantwrapper").css("display")=="block")
    {
      console.log("chat already visible");
      $("#canvasWrapper").removeClass("col-9");
      $("#canvasWrapper").addClass("col");
      $("#participantwrapper").css("display", "none");
      $("#chatwrapper").css("display", "none");
    }
    else {
    $("#canvasWrapper").removeClass("col");
    $("#canvasWrapper").addClass("col-9");
    $("#chatwrapper").css("display", "none");
    $("#participantwrapper").css("display", "block");
    }
    w = div.width();
    h = div.height();
    //console.log(w);
    //console.log(h);
    $canvas.width(w).height(h);

//set w & h for canvas
canvas.setHeight(h);
canvas.setWidth(w);
  }
  
  const editunedit=()=>{
     if(permissiontoedit==true)
     permissiontoedit=false;
     else permissiontoedit=true;
     //console.log(permissiontoedit);
  }
  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
   // console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }



/* try zone ends*/
/* radhu code add */
var previous;
$("#frame").on('click', function () {
  console.log("clicked"+this.value);
  socket.emit('showdb',ROOM_ID,this.value);
});
$("#frame").on('hover', function () {
  // Store the current value on focus and on change
  previous = this.value;
}).change(function() {
  // Do something with the previous value after the change
  alert(previous);
   let aux = canvas;
    let json = aux.toJSON();
    let data = {
        w: w,
        h: h,
        data: json
    };
    socket.emit('savedb', data, previous, ROOM_ID);
    //show the clicked frame 
    //canvas.clear();
    socket.emit('showdb',ROOM_ID,this.value);
  // Make sure the previous value is updated
  previous = this.value;
});

const addframe=(value)=>{
  
  alert(value);
    // let aux = canvas;
    // let json = aux.toJSON();
    // let data = {
    //     w: w,
    //     h: h,
    //     data: json
    // };
    // socket.emit('savedb', data, value, ROOM_ID);
    
};
$('#showframe').on('click',function(){
    socket.emit('showdb');
});
$('#add').on('click',function(){
//    $('#c').css('display',"block");
//    $('#cframe').css('display',"none");
    //   $('#c').css('z-index',"-1");
    //   $('#cframe').css('z-index',"9999");
    // $('#c').css('z-index',"9999");
    //   $('#cframe').css('z-index',"-1");
   
}); 

$(document).on('input', '#brushSize', function() {
  setBrush({width: $(this).val()});
});
let permissiontoedit= false;
//console.log(permissiontoedit.checked);
let canvas = new fabric.Canvas('c');
let isFreeDrawing = false;
let isRectActive = false, isCircleActive = false, 

isArrowActive = false, isLineActive = false, isTriActive = 

false,isHexaActive = false, isPentaActive = 

false,isHeptaActive = false,isOctaActive = false, 

isStarActive=false,Color = '#000000';
let isLoadedFromJson = false;

//init variables
let div = $("#canvasWrapper");
let $canvas = $("#c");
let $canvasframe= $("#cframe");
//width and height of canvas's wrapper
let w, h;
w = div.width();
h = div.height();
$canvasframe.width(w).height(h);
$canvas.width(w).height(h);

//set w & h for canvas
canvas.setHeight(h);
canvas.setWidth(w);


function downloadpdf()
{
var imgData = canvas.toDataURL("image/jpeg", 1.0);
var pdf = new jsPDF();
pdf.addImage(imgData, 'JPEG', 0, 0);
pdf.save("download.pdf");
}
function downloadimg()
{
$canvas.get(0).toBlob((blob)=>{
  saveAs(blob,"myimg.png");
 })
}

function initCanvas(canvas) {
  canvas.clear();
  canvas.freeDrawingBrush = new fabric.PencilBrush

(canvas);
  canvas.freeDrawingBrush.shadow = new 

fabric.Shadow({
      blur: 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: '#ffffff',
  });
  canvas.freeDrawingBrush.width = 5;
  canvas.isDrawingMode = false;

  return canvas;
}

function setBrush(options) {
  if (options.width !== undefined) {
      canvas.freeDrawingBrush.width = parseInt

(options.width, 10);
  }

  if (options.color !== undefined) {
      canvas.freeDrawingBrush.color = options.color;
  }
}

function setCanvasSelectableStatus(val) {
  canvas.forEachObject(function(obj) {
      obj.lockMovementX = ! val;
      obj.lockMovementY = ! val;
      obj.hasControls = val;
      obj.hasBorders = val;
      obj.selectable = val;
  });
  canvas.renderAll();
}

function setFreeDrawingMode(val) {
  isFreeDrawing = val;
  disableShapeMode();
}

function removeCanvasEvents() {
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  canvas.off('mouse:up');
  canvas.off('object:moving');
}

function enableShapeMode() {
  removeCanvasEvents();
  isFreeDrawing = canvas.isDrawingMode;
  canvas.isDrawingMode = false;
  canvas.selection = false;
  setCanvasSelectableStatus(false);
}

function disableShapeMode() {
  removeCanvasEvents();
  canvas.isDrawingMode = isFreeDrawing;
  if (isFreeDrawing) {
      $("#drwToggleDrawMode").addClass('active');
  }
  canvas.selection = true;
  isArrowActive = isRectActive = isCircleActive = 

isLineActive = isTriActive = isHexaActive = isPentaActive 

= isHeptaActive = isOctaActive = isStarActive= false;
  setCanvasSelectableStatus(true);
}

function deleteObjects() {
  let activeGroup = canvas.getActiveObjects();

  if (activeGroup) {
      canvas.discardActiveObject();
      activeGroup.forEach(function (object) {
          canvas.remove(object);
      });
  }
}

function emitEvent() {
  let aux = canvas;
  let json = aux.toJSON();
  let data = {
      w: w,
      h: h,
      data: json
  };
  //console.log("drawing");
  socket.emit('drawing', data,ROOM_ID);
}

function regularPolygonPoints(sideCount,radius){
  var sweep=Math.PI*2/sideCount;
  var cx=radius;
  var cy=radius;
  var points=[];
  for(var i=0;i<sideCount;i++){
      var x=cx+radius*Math.cos(i*sweep);
      var y=cy+radius*Math.sin(i*sweep);
      points.push({x:x,y:y});
  }
  return(points);
}

function starPolygonPoints(spikeCount, outerRadius, 

innerRadius) {
  var rot = Math.PI / 2 * 3;
  var cx = outerRadius;
  var cy = outerRadius;
  var sweep = Math.PI / spikeCount;
  var points = [];
  var angle = 0;

  for (var i = 0; i < spikeCount; i++) {
    var x = cx + Math.cos(angle) * outerRadius;
    var y = cy + Math.sin(angle) * outerRadius;
    points.push({x: x, y: y});
    angle += sweep;

    x = cx + Math.cos(angle) * innerRadius;
    y = cy + Math.sin(angle) * innerRadius;
    points.push({x: x, y: y});
    angle += sweep
  }
  return (points);
}

$(function () {


  //Canvas init
  initCanvas(canvas).renderAll();

  //canvas events

  canvas.on('after:render', function() {
      if (! isLoadedFromJson) {
          emitEvent();
      }
      isLoadedFromJson = false;
      //console.log(canvas.toJSON());
      
  });

  //dynamically resize the canvas on window resize
  $(window)
      .on('resize', function () {
          w = div.width();
          h = div.height();
          canvas.setHeight(h);
          canvas.setWidth(w);
          $canvas.width(w).height(h);
      })
      .on('keydown', function (e) {
          if (e.keyCode === 46) { //delete key
              deleteObjects();
          }
      });

      
    document.getElementById('file').onchange = function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) { console.log('fdsf');
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                // start fabricJS stuff
                
                var image = new fabric.Image(imgObj);
                image.set({
                    left: 250,
                    top: 50,
                    angle: 0,
                    padding: 10,
                    cornersize: 10
                });
                //image.scale(getRandomNum(0.1, 0.25)).setCoords();
                canvas.add(image);
                
                // end fabricJS stuff
            }
            
        }
        reader.readAsDataURL(e.target.files[0]);
    }
  //Set brush color
  
  

  $("#brushColor").on('change', function () {
      let val = $(this).val();
      activeColor = val;
      setBrush({color: val});
  });
 

  //Toggle between drawing tools
  $("#drwToggleDrawMode").on('click', function () {
    //console.log("pencil clicked");
    //console.log($("#toolbox button"));
      $("#toolbox button").removeClass('active');
      //console.log("DrawingMode"+canvas.isDrawingMode);
      if (canvas.isDrawingMode) {
          setFreeDrawingMode(false);
          $(this).removeClass('active');
      } else {
          setFreeDrawingMode(true);
          $(this).addClass('active');
      }
      //console.log("after click DrawingMode "+canvas.isDrawingMode);
  });
  $("#txtBox").on('click', function () {
    canvas.add(new fabric.IText('Tap and Type', { 
      fontSize: 20,
      left: 100, 
      top: 100 ,
    }));
  });
  $("#drwEraser").on('click', function() { deleteObjects(); 

});

  $("#drwClearCanvas").on('click', function () { 

canvas.clear(); });

  $("#shapeArrow").on('click', function () {
      if (! isArrowActive || (isRectActive || isCircleActive || 

isLineActive || isTriActive || isHexaActive || isPentaActive 

|| isHeptaActive || isOctaActive || isStarActive)) {
          disableShapeMode();
          $("#toolbox button").removeClass('active');
          $(this).addClass('active');
          isArrowActive = true;
          enableShapeMode();
          let arrow = new Arrow(canvas);
      } else {
          disableShapeMode();
          isArrowActive = false;
          $(this).removeClass('active');
      }
  });

  $("#shapeCircle").on('click', function () {
      if (! isCircleActive || (isRectActive || isArrowActive ||

isLineActive || isTriActive || isHexaActive || isPentaActive 

|| isHeptaActive || isOctaActive || isStarActive)) {
          disableShapeMode();
          $("#toolbox button").removeClass('active');
          $(this).addClass('active');
          isCircleActive = true;
          enableShapeMode();
          let circle = new Circle(canvas);
      } else {
          disableShapeMode();
          isCircleActive = false;
          $(this).removeClass('active');
      }
  });

  $("#shapeRect").on('click', function () {
      if (! isRectActive || (isArrowActive || isCircleActive || 

isLineActive || isTriActive || isHexaActive || isPentaActive 

|| isHeptaActive || isOctaActive || isStarActive)) {
          disableShapeMode();
          isRectActive = true;
          $("#toolbox button").removeClass('active');
          $(this).addClass('active');
          enableShapeMode();
          let squrect = new Rectangle(canvas);
      } else {
          isRectActive = false;
          disableShapeMode();
          $(this).removeClass('active');
      }
  });

  $("#shapeLine").on('click', function () {
    if (! isLineActive || (isArrowActive || isCircleActive || 

isRectActive || isTriActive || isHexaActive || isPentaActive 

|| isHeptaActive || isOctaActive || isStarActive)) {
        disableShapeMode();
        isLineActive = true;
        $("#toolbox button").removeClass('active');
        $(this).addClass('active');
        enableShapeMode();
        let line = new Line(canvas);
    } else {
        isLineActive = false;
        disableShapeMode();
        $(this).removeClass('active');
    }
});

$("#shapeTri").on('click', function () {
  if (! isTriActive || (isArrowActive || isCircleActive || 

isRectActive || isLineActive || isHexaActive || 

isPentaActive || isHeptaActive || isOctaActive || 

isStarActive)) {
      disableShapeMode();
      isTriActive = true;
      $("#toolbox button").removeClass('active');
      $(this).addClass('active');
      enableShapeMode();
      var triangle = new fabric.Triangle({
        width: 150,
        height: 100,
        fill: '',
        stroke: 'black',
        strokeWidth: 3,
      });

      // Render the triangle in canvas
      canvas.add(triangle);
      canvas.centerObject(triangle);
      

  } else {
      isTriActive = false;
      disableShapeMode();
      $(this).removeClass('active');
  }
});



$("#shapeHexa").on('click', function () {
  if (! isHexaActive  || (isArrowActive || isCircleActive || 

isRectActive || isTriActive ||isLineActive || isPentaActive || 

isHeptaActive || isOctaActive || isStarActive)) {
      disableShapeMode();
      isHexaActive = true;
      $("#toolbox button").removeClass('active');
      $(this).addClass('active');
      enableShapeMode();
      var points=regularPolygonPoints(6,30);

      var hexagon = new fabric.Polygon(points, {
        stroke: 'black',
        left: 100,
        top: 100,
        strokeWidth: 3,
        fill:'',
        strokeLineJoin: 'black'
      },false);
      canvas.add(hexagon);
      canvas.centerObject(hexagon);

  } else {
      isHexaActive = false;
      disableShapeMode();
      $(this).removeClass('active');
  }
});


$("#shapePenta").on('click', function () {
if (!isPentaActive || (isArrowActive || isCircleActive || 

isRectActive || isLineActive || isTriActive || isHexaActive || 

isHeptaActive || isOctaActive || isStarActive)) {
    disableShapeMode();
    isPentaActive = true;
    $("#toolbox button").removeClass('active');
    $(this).addClass('active');
    enableShapeMode();
    
    var points=regularPolygonPoints(5,30);

    var pentagon = new fabric.Polygon(points, {
      stroke: 'black',
      left: 100,
      top: 100,
      strokeWidth: 3,
      fill:'',
      strokeLineJoin: 'black'
    },false);
    canvas.add(pentagon);
    canvas.centerObject(pentagon);


} else {
    isPentaActive = false;
    disableShapeMode();
    $(this).removeClass('active');
}
});

$("#shapeHepta").on('click', function () {
if (!isHeptaActive || (isArrowActive || isCircleActive || 

isRectActive || isLineActive || isTriActive || isHexaActive || 

isPentaActive || isOctaActive || isStarActive)) {
    disableShapeMode();
    isHeptaActive = true;
    $("#toolbox button").removeClass('active');
    $(this).addClass('active');
    enableShapeMode();
    
    var points=regularPolygonPoints(7,30);

    var heptagon = new fabric.Polygon(points, {
      stroke: 'black',
      left: 100,
      top: 100,
      strokeWidth: 3,
      fill:'',
      strokeLineJoin: 'black'
    },false);
    canvas.add(heptagon);
    canvas.centerObject(heptagon);


} else {
    isHeptaActive = false;
    disableShapeMode();
    $(this).removeClass('active');
}
});

$("#shapeOcta").on('click', function () {
if (!isOctaActive || (isArrowActive || isCircleActive || 

isRectActive || isLineActive || isTriActive || isHexaActive || 

isPentaActive ||isHeptaActive || isStarActive)) {
    disableShapeMode();
    isOctaActive = true;
    $("#toolbox button").removeClass('active');
    $(this).addClass('active');
    enableShapeMode();
    
    var points=regularPolygonPoints(8,30);

    var octagon = new fabric.Polygon(points, {
      stroke: 'black',
      left: 100,
      top: 100,
      strokeWidth: 3,
      fill:'',
      strokeLineJoin: 'black'
    },false);
    canvas.add(octagon);
    canvas.centerObject(octagon);


} else {
    isOctaActive = false;
    disableShapeMode();
    $(this).removeClass('active');
}
});

$("#shapeStar").on('click', function () {
if (!isOctaActive || (isArrowActive || isCircleActive || 

isRectActive || isLineActive || isTriActive || isHexaActive || 

isPentaActive ||isHeptaActive || isOctaActive)) {
    disableShapeMode();
    isStarActive = true;
    $("#toolbox button").removeClass('active');
    $(this).addClass('active');
    enableShapeMode();
    
    var points=starPolygonPoints(5,50,25);

    var star = new fabric.Polygon(points, {
      stroke: 'black',
      left: 100,
      top: 10,
      strokeWidth: 3,
      fill:'',
      strokeLineJoin: 'black'
    },false);
    canvas.add(star);
    canvas.centerObject(star);


} else {
    isStarActive = false;
    disableShapeMode();
    $(this).removeClass('active');
}
});


  $("#debugButton").on('click', function () {
      deleteObjects();
  });

  canvas.renderAll();

  //Sockets
  //socket.emit('ready', "Page loaded");
  
  socket.on('drawing', function (obj) {
  
      //set this flag, to disable infinite rendering loop
      isLoadedFromJson = true;

      //calculate ratio by dividing this canvas width to 

//sender canvas width
      let ratio = w / obj.w;

      //reposition and rescale each sent canvas object
      obj.data.objects.forEach(function(object) {
          object.left *= ratio;
          object.scaleX *= ratio;
          object.top *= ratio;
          object.scaleY *= ratio;
      });
      console.log(permissiontoedit);
      if(permissiontoedit==true)
      canvas.loadFromJSON(obj.data);
  });
  

});






