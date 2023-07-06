let canvas= document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let mousedown=false;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download") ;
let redo= document.querySelector(".redo");
let undo= document.querySelector(".undo");


let penColor= "red";
let eraserColor="white";
let penWidth= pencilWidthElem.value;
let eraserWidth =eraserWidthElem.value;

let undoRedotracker = [];//data
let track=0 ; //represent which action from  tracker aaray
//API
let tool=canvas.getContext("2d");//api

tool.strokeStyle=penColor;
tool.lineWidth=penWidth;
// tool.beginPath(); //new path line
// tool.moveTo(10,10); //start point
// tool.lineTo(100,150);//end pont
// tool.stroke(); //fill color (fill graphic)
// tool.lineTo(200,250);
// tool.stroke();

//mousedown ->start new path,mousemove ->path fill(graphic)
canvas.addEventListener("mousedown",(e)=>{
    mousedown=true;
    beginPath({
        x:e.clientX,
        y:e.clientY   
    });
    // let data={
    //     x:e.clientX,
    //     y:e.clientY 
    // }
    // //send dat to server
    // socket.emit("beginPath",data);
})
canvas.addEventListener("mousemove",(e)=>{
    if(mousedown){
       
        drawStroke({
                x:e.clientX,
                y:e.clientY,
                color: eraserFlag? eraserColor:penColor,
                width: eraserFlag? eraserWidth:penWidth,
            });

       
    }
    // 
    
})
canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;
    let url =canvas.toDataURL();
    undoRedotracker.push(url);
    track= undoRedotracker.length-1;
})

undo.addEventListener("click",(e)=>{
    if(track>0) track--;
    let trackObj={
        trackValue:track,
        undoRedotracker
    }
    socket.emit("redoUndo",data);
    undoRedoCanvas(trackObj);

})
redo.addEventListener("click",(e)=>{
    if(track<undoRedotracker.length-1) track++;
    //action
    let trackObj={
        trackValue:track,
        undoRedotracker
    }
    undoRedoCanvas(trackObj);
})
function undoRedoCanvas (trackObj){
    track=trackObj.trackValue;
    undoRedotracker=trackObj.undoRedotracker;
    let url =undoRedotracker[track];
    let img =new Image() ;//new image refrence element
    img.src=url;
    img.onload = (e)=> {
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}
 



function beginPath(strokeObj){
    tool.beginPath(); //new path line
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((coolorElem)=>{
    coolorElem.addEventListener("click",(e)=>{
        let color=coolorElem.classList[0];
        penColor=color;
        tool.strokeStyle=penColor;
    })
})

pencilWidthElem.addEventListener("change",(e)=>{
    penWidth= pencilWidthElem.value;
    tool.lineWidth=penWidth;

})

eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth= eraserWidthElem.value;
    tool.lineWidth=penWidth;
})
eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle=eraserColor;
        tool.lineWidth=eraserWidth;
    }else{
        tool.strokeStyle=penColor;
        tool.lineWidth=penWidth;
    }
})

download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();
    let a= document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})



// socket.on("beginPath",(data)=>{
//     //data->data from server
//     beginPath(data);
// })

// socket.on("drawStroke",(data)=>{
//     //data->data from server
//     drawStroke(data);
// })
// socket.on("redoUndo",(data)=>{
//     //data->data from server
//     redoUndo(data);
// // })