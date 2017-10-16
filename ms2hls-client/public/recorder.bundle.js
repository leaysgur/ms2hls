/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const uuid = __webpack_require__(1);
const Timemitter = __webpack_require__(5).default;

const { serverUrl } = __webpack_require__(6);

const [$vLocal, $vRemote, $rStart, $rStop] = document.querySelectorAll('button');
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
const peer = new window.Peer('ms2hls-recorder', {
  key: '84197755-72ad-4e5a-834b-7556de52ed6b',
  debug: 3,
});

$vLocal.onclick = onClickLocalStream;
$vRemote.onclick = onClickRemoteStream;
$rStart.onclick = onClickRecordStart;
$rStop.onclick = onClickRecordStop;

function onClickLocalStream() {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 480,
      height: 640,
    },
    audio: true
  })
    .then(stream => {
      $video.srcObject = stream;
      $video.play();
      $video.srcObject.getTracks().forEach(track => console.log(track.getSettings()));

      $vLocal.disabled = true;
      $vRemote.disabled = true;
      $rStart.disabled = false;
    });
}

function onClickRemoteStream() {
  const conn = peer.call('ms2hls-reporter');

  conn.on('stream', stream => {
    $video.srcObject = stream;
    $video.play();
    $video.srcObject.getTracks().forEach(track => console.log(track.getSettings()));

    $vLocal.disabled = true;
    $vRemote.disabled = true;
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

    fetch(`${serverUrl}/api/chunks/${liveId}`, {
      method: 'post',
      body: payload,
    });
  };

  recorder.onstop = () => {
    if (needFinalize === false) { return; }

    console.log('finalize', liveId);
    fetch(`${serverUrl}/api/finalize/${liveId}`)
      .then(() => {
        console.log(`${serverUrl}/live/${liveId}/playlist.m3u8`);
      });
  };

  console.log('initialize', liveId);
  fetch(`${serverUrl}/api/initialize/${liveId}`)
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(2);
var bytesToUuid = __webpack_require__(4);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class TimeEmitter {
  constructor () {
    this.time = 0;

    this._atHandlers = new Map();
    this._everyHandlers = new Map();

    this._timer = 0;
  }

  start(interval = 1000) {
    // run only once
    if (this._timer !== 0) {
      return this;
    }

    // for 0
    this._fireByTime(this.time);

    this._timer = setInterval(() => {
      this.time++;

      this._fireByTime(this.time);
    }, interval);

    return this;
  }

  destroy() {
    this._atHandlers.clear();
    this._everyHandlers.clear();

    clearInterval(this._timer);
    this._timer = 0;

    return this;
  }

  at(time, handler) {
    if (typeof time !== 'number') { return; }
    if (typeof handler !== 'function') { return; }

    // accept > 0
    if (time < 0) {
      time = 0;
    }

    if (this._atHandlers.has(time)) {
      this._atHandlers.get(time).push(handler);
    } else {
      this._atHandlers.set(time, [handler]);
    }

    return this;
  }

  every(time, handler) {
    if (typeof time !== 'number') { return; }
    if (typeof handler !== 'function') { return; }

    // accept > 1
    if (time < 1) {
      time = 1;
    }

    if (this._everyHandlers.has(time)) {
      this._everyHandlers.get(time).push(handler);
    } else {
      this._everyHandlers.set(time, [handler]);
    }

    return this;
  }

  reset() {
    this.time = 0;
    this._fireByTime(this.time);

    return this;
  }

  _fireByTime(time) {
    const atHandlers = this._atHandlers.get(time);
    if (atHandlers) {
      for (let handler of atHandlers) {
        handler(time);
      }
    }

    const everyKeys = this._everyHandlers.keys();
    for (let key of everyKeys) {
      if (time > 0 && time % key === 0) {
        const handlers = this._everyHandlers.get(key);
        if (handlers) {
          for (let handler of handlers) {
            handler(time);
          }
        }
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = (TimeEmitter);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// const serverUrl = 'http://localhost:9999';
const serverUrl = 'http://192.168.100.25:9999';

module.exports = {
  serverUrl,
};


/***/ })
/******/ ]);