// Make connection
var socket1 = io.connect('http://localhost:8080', { transport: ['websocket']});

socket1.on('registered', () => {
    console.log('socket1 received registered event')
})

socket1.on('message', data => {
    console.log('socket1 got the following data:', data)
    setTimeout(() => {
        socket1.emit('message', {
          srcUser: 1,
          dstUser: 2,
          msg: data.msg + '-1'
     })
    }, 1000)
});
socket1.on('connected', () => {
    console.log('socket1 received connected event');
    socket1.emit('register_client', 1)
});


//==============================================
// socket 2 mimicking second user
//==============================================
var socket2 = io.connect('http://localhost:8080', { transport: ['websocket']});
socket2.on('registered', data => {
    console.log('socket2 received registered event')
})

socket2.on('registered', () => {
    console.log('socket2 received registered event')
    socket2.emit('message', {
        srcUser: 2,
        dstUser: 1,
        msg: 'sameer you are a genius!',
    })
})

socket2.on('message', data => {
    console.log('socket2 got the following data:', data)
    socket2.emit('message', {
        srcUser: 2,
        dstUser: 1,
        msg: data.msg + '-2'
    })
});

socket2.on('connected', () => {
    console.log('socket2 received connected event');
    socket2.emit('register_client', 2)
});