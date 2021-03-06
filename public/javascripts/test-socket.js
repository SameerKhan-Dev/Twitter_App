// Make connection
var socket = io.connect('http://localhost:8080', { transport: ['websocket']});
socket.emit('event', 'hi from client');
socket.on('response', data => console.log('response is:', data))