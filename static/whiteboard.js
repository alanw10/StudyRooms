// whiteboard.js

// Variables to store canvas, context, and drawing status
let canvas;
let ctx;
let isDrawing = false;

// Function to initialize the whiteboard
function initWhiteboard() {
    canvas = document.getElementById('whiteboardCanvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseout', endDrawing);
}

// Function to start drawing
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

// Function to draw on the canvas
function draw(e) {
    if (!isDrawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000'; // Black color for drawing

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Function to end drawing
function endDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Start a new path for future drawing
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
