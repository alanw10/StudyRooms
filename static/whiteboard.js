
let canvas;
let ctx;
let isDrawing = false;


function initWhiteboard() {
    canvas = document.getElementById('whiteboardCanvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseout', endDrawing);
}


function startDrawing(e) {
    isDrawing = true;
    draw(e);
}


function draw(e) {
    if (!isDrawing) return;x

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000'; 

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}


function endDrawing() {
    isDrawing = false;
    ctx.beginPath();
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

