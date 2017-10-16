const $video = document.querySelector('video');
const peer = new window.Peer('ms2hls-reporter', {
  key: '84197755-72ad-4e5a-834b-7556de52ed6b',
  // debug: 3,
});

navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment',
    width: 1280,
  },
  audio: true
})
  .then(stream => {
    $video.srcObject = stream;
    $video.play();
    $video.srcObject.getTracks().forEach(track => console.log(track.getSettings()));
  });

peer.on('open', () => {
  peer.on('call', conn => {
    conn.answer($video.srcObject);
  });
});
