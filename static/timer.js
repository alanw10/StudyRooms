var socket = io.connect('http://' + document.domain + ':' + location.port);
var timerPaused = false; 

socket.on('timer', function(data) {
    var minutes = Math.floor(data.time / 60);
    var seconds = data.time % 60;
    document.getElementById('timer').innerHTML = 'Countdown: ' + minutes + ' minutes ' + (seconds < 10 ? '0' : '') + seconds + ' seconds';
});

socket.on('timer_event', function(data) {
    alert(data.data);
});

function setTimer() {
    var duration = document.getElementById('duration').value;
    socket.emit('set_timer', { duration: duration });
}

function startTimer() {
    socket.emit('start_timer');
}

function togglePause() {
    timerPaused = !timerPaused; 
    socket.emit('toggle_pause', { paused: timerPaused }); 
}

function resetTimer() {
    socket.emit('reset_timer'); 
}

socket.on('timer_paused', function(data) {
    if (data.paused) {
        document.getElementById('pauseButton').innerText = 'Resume';
    } else {
        document.getElementById('pauseButton').innerText = 'Pause'; 
    }
});
