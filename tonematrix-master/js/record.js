var context = new webkitAudioContext();
var offline = new webkitOfflineAudioContext(2, 10 * 44100, 44100);
var blob;
var bufferLoader;
 
bufferLoader = new BufferLoader(
  context, [
    '/sound/sound1.mp3',
  ],
  finishedLoading
);
 
bufferLoader.load();
 
  function finishedLoading(bufferList) {
    console.log('finishedLoading');
    var source1 = offline.createBufferSource();
    source1.buffer = bufferList[0];
 
    lowpass = offline.createBiquadFilter();
    lowpass.type = 0;
    lowpass.frequency.value = 0;
 
    source1.connect(lowpass);
    lowpass.connect(offline.destination);
    source1.start(0);
 
    offline.startRendering();
  }
 
 
offline.oncomplete = function(ev) {
  console.log('oncomplete');
  var source = context.createBufferSource();
  source.buffer = ev.renderedBuffer;
  source.connect(context.destination);
  source.start(0);
  sendWaveToPost(ev.renderedBuffer);
}
 
function sendWaveToPost(buffer) {
  var worker = new Worker('js/recorderWorker.js');
 
  // initialize the new worker
  worker.postMessage({
    command: 'init',
    config: {
      sampleRate: 44100
    }
  });
 
  // callback for `exportWAV`
  worker.onmessage = function(e) {
    blob = e.data;
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    console.log(url);
    var data = new FormData();
 
    data.append("audio", blob, (new Date()).getTime() + ".wav");
 
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "/audio/save_file");
    oReq.send(data);
    oReq.onload = function(oEvent) {
      if (oReq.status == 200) {
        console.log("Uploaded");
      } else {
        console.log("Error " + oReq.status + " occurred uploading your file.");
      }
    };
  };
 
  // send the channel data from our buffer to the worker
  worker.postMessage({
    command: 'record',
    buffer: [
      buffer.getChannelData(0),
      buffer.getChannelData(1)
    ]
  });
 
  // ask the worker for a WAV
  worker.postMessage({
    command: 'exportWAV',
    type: 'audio/wav'
  });
}