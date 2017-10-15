const uuid = require('uuid/v4');
const Timemitter = require('timemitter').default;

const { apiUrl } = require('./config');

const [$vLocal, $rStart, $rStop] = document.querySelectorAll('button');
const [$video] = document.querySelectorAll('video');

let recorder = null;
let chunkCnt = 1;

const liveId = uuid();
const emitter = new Timemitter();

$vLocal.onclick = onClickLocalStream;
$rStart.onclick = onClickRecordStart;
$rStop.onclick = onClickRecordStop;

function onClickLocalStream() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      $video.srcObject = stream;
      $video.play();

      $vLocal.disabled = true;
      $rStart.disabled = false;
    });
}

function onClickRecordStart() {
  emitter
    .at(0, () => {
      recorder = new MediaRecorder($video.srcObject);

      // called only once at stop(), ondataavailable -> onstop
      recorder.ondataavailable = ev => {
        const blob = new Blob([ev.data], { type: recorder.mimeType });

        const payload = new FormData();
        payload.append('webm', blob, `${chunkCnt}.webm`);

        chunkCnt++;

        fetch(`${apiUrl}/chunks/${liveId}`, {
          method: 'post',
          body: payload,
        });
      };

      recorder.start();

      fetch(`${apiUrl}/initialize/${liveId}`);

      console.log('initialize', liveId);
    })
    .every(4, time => {
      recorder.stop();
      recorder.start();

      console.log('send chunk', time, liveId);
    })
    .start();

  $rStart.disabled = true;
  $rStop.disabled = false;
}

function onClickRecordStop() {
  // send last chunk manually
  recorder.stop();
  emitter.destroy();

  fetch(`${apiUrl}/finalize/${liveId}`);
  console.log('finalize', liveId);

  $rStop.disabled = true;
}
