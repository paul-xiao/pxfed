# socket.io
> http://www.storagelab.org.cn/liangli/2016/03/04/%e8%bd%ac%ef%bc%9asocket-emit-%e5%92%8c-socket-broadcast-emit%e7%9a%84%e5%8c%ba%e5%88%ab/
```js

// send to current request socket client
socket.emit('message', "this is a test");
 
// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");
 
// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');
 
// sending to all clients, include sender
io.sockets.emit('message', "this is a test");
 
// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');
 
// sending to individual socketid
io.sockets.socket(socketid).emit('message', 'for your eyes only');

```