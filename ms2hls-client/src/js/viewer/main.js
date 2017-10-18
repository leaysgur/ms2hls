const $video = document.querySelector('video');
const $streamUrl = document.querySelector('input');
const $playBtn = document.querySelector('button');

$playBtn.onclick = () => {
  const url = $streamUrl.value;

  if (!url) {
    console.error('url is empty!');
    return;
  }

  const play = isSafari() ? playHLS : playHLSjs;
  play(url, $video);
};

function playHLSjs(url, $video) {
  const hls = new window.Hls();
  hls.attachMedia($video);

  hls.loadSource(url);
  hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
    $video.play();
  });
  hls.on(window.Hls.Events.ERROR, (ev, data) => {
    console.error(ev);
    console.error(data);
  });
}

function playHLS(url, $video) {
  $video.src = url;
  $video.play();
}

function isSafari() {
  const { userAgent } = navigator;
  const chrome = userAgent.indexOf('Chrome') > -1;
  const safari = userAgent.indexOf('Safari') > -1;

  return chrome === false && safari;
}
