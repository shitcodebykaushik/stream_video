import http from 'http'
import path from 'path'
import {spawn} from 'child_process'
import express from 'express'
import {Server as SocketIO} from 'socket.io' 
 // Here we have impoerted the socket io library .

const app =express();
const server = http.createServer(app);
const io = new  SocketIO(server) ; 
// This is our socket io server . and we have passed the insatance of the (server) here
const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2`,
];
const ffmpegProcess = spawn ('ffmpeg',options);

ffmpegProcess.stdout.on ('data',(data)=>{
    console .log (`ffmpeg stdout: ${data}`);
});
ffmpegProcess.stderr.on ('data',(data)=> {
    console.error(`ffmpeg stderr: ${data}`);
});



//middleware 
app.use (express.static(path.resolve('./public')));

io.on ('connection', socket => {
    console.log('Socket Connected',socket.id);
    socket.on('binarystream', stream => {   
        console.log('Binary Stream Incomming...')
        ffmpegProcess.stdin.write(stream,(err) => {
            console.log ("Error",err)
        })
    })
})

server.listen(3000,() => console.log("Serever is running on PORT 3000 "));