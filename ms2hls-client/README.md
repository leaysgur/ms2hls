# ms2hls-client

Client implementation for ms2hls.

### `/public/recorder.html`

Record local or remote MediaStream with MediaRecorder.
Then send each segmanet as `.webm` every 4 seconds.

### `/public/reporter.html`

For remote stream sends to recorder.
Using WebRTC via SkyWay.

### `/public/viewer.html`

HLS viewer.
If browser is Safari, native `video` element is used, otherwise HLS.js is used.
