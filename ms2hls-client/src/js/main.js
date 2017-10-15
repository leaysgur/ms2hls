const uuid = require('uuid/v4');
const Timemitter = require('timemitter').default;

const [$vLocal, $rStart, $rStop] = document.querySelectorAll('button');
const [$video] = document.querySelectorAll('video');

const apiUrl = '//localhost:9999/api';

let recorder = null;
let liveId = '';

const emitter = new Timemitter();
emitter
  .at(0, () => {
    recorder = new MediaRecorder($video.srcObject);

    // called only once at stop(), ondataavailable -> onstop
    recorder.ondataavailable = ev => {
      const blob = new Blob([ev.data], { type: recorder.mimeType });

      const payload = new FormData();
      payload.append('webm', blob, `${Date.now()}.webm`);

      fetch(`${apiUrl}/chunks/${liveId}`, {
        method: 'post',
        body: payload,
      });
    };

    recorder.start();

    liveId = uuid();
    fetch(`${apiUrl}/initialize/${liveId}`);
  })
  .every(4, time => {
    console.log('TODO: send chunk', time, liveId);
    recorder.stop();
    recorder.start();
  });

$vLocal.onclick = () => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      $video.srcObject = stream;
      $video.play();

      $vLocal.disabled = true;
      $rStart.disabled = false;
    });
};

$rStart.onclick = () => {
  emitter.start();

  $rStart.disabled = true;
  $rStop.disabled = false;
};

$rStop.onclick = () => {
  // send last one manually
  recorder.stop();
  emitter.destroy();

  $rStart.disabled = false;
  $rStop.disabled = true;
};
