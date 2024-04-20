var socket = io.connect('http://' + document.domain + ':' + location.port);

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
