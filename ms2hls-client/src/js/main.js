const uuid = require('uuid/v4');
const Timemitter = require('timemitter').default;

const { apiUrl } = require('./config');

const [$vLocal, $rStart, $rStop] = document.querySelectorAll('button');
const [$video] = document.querySelectorAll('video');

let recorder = null;
let chunkCnt = 1;
let needFinalize = false;

const liveId = uuid();
const emitter = new Timemitter();
emitter
  .every(4, time => {
    recorder.stop();
    recorder.start();

    console.log('send chunk', time, liveId);
  });

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

  recorder.onstop = () => {
    if (needFinalize === false) { return; }

    console.log('finalize', liveId);
    fetch(`${apiUrl}/finalize/${liveId}`);
  };

  console.log('initialize', liveId);
  fetch(`${apiUrl}/initialize/${liveId}`)
    .then(() => {
      recorder.start();
      emitter.start();
    });

  $rStart.disabled = true;
  $rStop.disabled = false;
}

function onClickRecordStop() {
  needFinalize = true;

  // send last chunk manually
  recorder.stop();
  emitter.destroy();

  $rStop.disabled = true;
}
