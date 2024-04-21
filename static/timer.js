var socket = io.connect('http://' + document.domain + ':' + location.port);
var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('timer', function(data) {
    var minutes = Math.floor(data.time / 60);
    var seconds = data.time % 60;
    document.getElementById('timer').innerHTML = 'Countdown: ' + minutes + ' minutes ' + (seconds < 10 ? '0' : '') + seconds + ' seconds';
});

socket.on('timer_event', function(data) {
    alert(data.data);
});

function setTimer() {
    var input = document.getElementById('duration').value;
    var duration = parseInt(input);
    // If the input length is 4 or more, interpret the first two digits as minutes
    if (input.length >= 4) {
        var minutes = parseInt(input.substring(0, input.length - 2));
        var seconds = parseInt(input.substring(input.length - 2));
        duration = (minutes * 60) + seconds;
    }
    socket.emit('set_timer', { duration: duration });
}

function startTimer() {
    socket.emit('start_timer');
}

function stopTimer() {
    alert('Timer stopped');
}
socket.on('timer', function(data) {
    document.getElementById('timer').innerHTML = 'Countdown: ' + data.time + ' seconds';
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

function stopTimer() {
    alert('Timer stopped');
}

