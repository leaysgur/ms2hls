const Timemitter = require('timemitter').default;

const [$vLocal, $rStart, $rStop] = document.querySelectorAll('button');
const [$video] = document.querySelectorAll('video');

const apiUrl = '//localhost/api';

let recorder = null;
let chunks = [];

const emitter = new Timemitter();
emitter
  .at(0, () => {
    console.log('TODO: create chunk dir');
    // fetch(`${apiUrl}/init?id=`, {});
  })
  .every(4, time => {
    console.log('TODO: send chunk', time);
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
  recorder = new MediaRecorder($video.srcObject);

  emitter.start();

  chunks = [];

  recorder.ondataavailable = ev => {
    chunks.push(ev.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: recorder.mimeType });

    const payload = new FormData();
    payload.append('webm', blob, '1.webm');

    fetch(`${apiUrl}/chunks`, {
      method: 'post',
      body: payload,
    })
      .then(() => {
        chunks = [];
        recorder = null;
      });

    console.log('TODO: send chunk manually');
  };

  recorder.start();

  $rStart.disabled = true;
  $rStop.disabled = false;
};

$rStop.onclick = () => {
  recorder.stop();
  emitter.destroy();

  $rStart.disabled = false;
  $rStop.disabled = true;
};
