const socket = io('http://localhost:3000');

const form = document.getElementById('send-container')
const messageinput = document.getElementById('messageinp')
const messagecontainer = document.querySelector('.messagearea')
var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageelement = document.createElement('div');
    messageelement.innerText = message;
    messageelement.classList.add('incoming');
  
    messageelement.classList.add(position);
    messagecontainer.append(messageelement);

    //audio while receiving message 
    if (position == 'right') {
        audio.play();
    }
}


const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);


socket.on("user-joined", name => {
    append(`${name} joined the chat`, 'incoming')
})

socket.on("receive", data => {
    append(` ${data.message}`, 'incoming')
    scrolltobottom()
})

socket.on("left", name => {
    append(`${name} left the chat`, 'incoming')
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = messageinput.value;
    append(`${message}`, 'outgoing');
    socket.emit('send', message);
    messageinput.value = ''
    scrolltobottom()
})

function scrolltobottom()
{
    messagearea.scrollTop = messagearea.scrollHeight
}