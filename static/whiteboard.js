var socket = io();

var canvas = document.getElementById('whiteboard');
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); 

var isDrawing = false;
var startX;
var startY;

function startDrawing(e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    
    socket.emit('draw', { startX: startX, startY: startY, endX: e.offsetX, endY: e.offsetY });

    // Update the start position for the next segment
    startX = e.offsetX;
    startY = e.offsetY;
}

function stopDrawing() {
    isDrawing = false;
}

socket.on('draw', function(data) {
    ctx.beginPath();
    ctx.moveTo(data.startX, data.startY);
    ctx.lineTo(data.endX, data.endY);
    ctx.stroke();
});