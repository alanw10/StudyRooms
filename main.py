from flask import Flask, render_template, request, session, redirect,url_for
from flask_socketio import join_room, leave_room, send, SocketIO, emit
import random
import time, threading
from string import ascii_uppercase

app = Flask(__name__)
app.config["SECRET_KEY"] = "iloveflask"
socketio = SocketIO(app)

timers = {}
countdown_time = 0
countdown_active = False
rooms = {}
def generate_unique_code(len):
    while True:
        code = ""
        for _ in range(len):
            code += random.choice(ascii_uppercase)
        if code not in rooms:
            break
    return code



@app.route("/", methods = ["POST", "GET"])
def home():
    if request.method == "POST":
        name = "alan"#request.form.get()
        code = request.form.get("code")
        join = request.form.get("join", False)
        create = request.form.get("create", False)
        if not name:
            return render_template("home.html", error ="Please enter a name", code = code, name=name)
        if join and not code:
            return render_template("home.html", error ="Please enter a room code", code = code, name=name)
        
        room = code
        if create != False:
            room = generate_unique_code(4)
            rooms[room] = {"members": 0, "messages": []}
        elif code not in rooms:
            return render_template("home.html", error ="Room doesn't exist", code = code, name=name)
        session["room"] = room
        session["name"] = name
        return redirect(url_for("room"))
    return render_template("home.html")
@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms: # if theres no room, no name, or invalid room
        return redirect(url_for("home"))
    return render_template("room.html", code = room, messages = rooms[room]["messages"])

@socketio.on("message")
def message(data):
    room = session.get("room")
    if room not in rooms:
        return 
    
    content = {
        "name": session.get("name"),
        "message": data["data"],
        "time":  time.strftime("%H:%M:%S",time.localtime())

    }
    send(content,to=room)
    rooms[room]["messages"].append(content)
    print(f"{session.get('name')} said {data['data']}")

@socketio.on("connect")
def connect(auth):
    room = session.get("room")
    name = session.get("name")
    if not room or not name:
        return
    if room not in rooms:
        leave_room(room)
        return
    
    join_room(room)
    send({"name": name, "message": "has entered the room.", "time":  time.strftime("%H:%M:%S",time.localtime())
}, to=room)
    rooms[room]["members"] += 1
    print(f"{name} joined room {room}")
@socketio.on("disconnect")
def disconnect():
    room = session.get("room")
    name = session.get("name")
    leave_room(room)
    #if room in rooms:
        #rooms[room]["members"] -= 1
        #if rooms[room]["members"] <= 0:
            #del rooms[room]
    send({"name": name, "message": "has left the room.","time":  time.strftime("%H:%M:%S",time.localtime())
}, to=room)
    print(f"{name} has left the room.")

@socketio.on('set_timer')
def set_timer(data):
    global countdown_time
    countdown_time = int(data['duration'])
    emit('timer_event', {'data': f'Timer set to {countdown_time} seconds'})

@socketio.on('start_timer')
def start_timer():
    global countdown_active
    if not countdown_active and countdown_time > 0:
        countdown_active = True
        threading.Thread(target=timer).start()

def timer():
    global countdown_time, countdown_active
    start_time = time.time()
    while countdown_time > 0:
        current_time = int(time.time() - start_time)
        countdown_time = max(0, countdown_time - 1)
        socketio.emit('timer', {'time': countdown_time})
        time.sleep(1)
    countdown_active = False
    if countdown_time == 0:
        socketio.emit('timer_event', {'data': 'Connected'})
if __name__ == "__main__":
    socketio.run(app, debug=True)