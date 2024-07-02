const userVideo =document.getElementById('user-video')
const startButtom =document.getElementById('start-btn')

const state = {media: null}
const socket = io()
startButtom.addEventListener('click',()=> {
    const mediaRecorder = new MediaRecorder (state.media,{
    // It is important to set the bit reate .If we increase the bit reate then it will increase the load of the CPu
    audioBitsPerSecond: 128000,
    videoBitPerSecond: 2500000,
    framerate: 25
})
 // Now we are setting the event listenr over the bit rate .

 mediaRecorder.ondataavailable = ev => {
    console.log('Binary Stream Available', ev.data)
    socket.emit('binarystream', ev.data)
}

mediaRecorder.start(25)

})


window.addEventListener('load',async e => {
    const media =await navigator
       .mediaDevices
       .getUserMedia({audio:true,video:true})
       state.media = media
        userVideo.srcObject = media
})
