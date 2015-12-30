if (!window.AudioContext)
{
	alert('No WebAudio support');
}
else
{

  var circleId = ['a','b','c','d'];
  var positionId = ['1','2','3','4','5','6','7','8'];
  var directory = [];
  var instuColors = [];
  var directoryIndex = 0;
  var sourceIndex = 0;
  var pisteIndex = 1;
  var sourceTemp = [];
  var source = [];
  var Recordings = [];
  var sourceRecordings = [sourceRecordings()];
  var trackerTask;

  localStorage.setItem("ListenToBuzzer","true");
  currentDir = sampledirectory();
  
  readXMLSessionInstru();

  for (var k = 0; k < directory.length; k++) {
    for (var i = 0; i < circleId.length; i++) {
      for (var j = 0; j < positionId.length; j++) {
        if (pisteIndex < 10) {
            piste = '0' + pisteIndex;
        }
        else{
          piste = pisteIndex;
        };
        sourceTemp[k][sourceIndex] = directory[k] + '- '+ piste + ' - Audio - '+ circleId[i] + positionId[j] + '.wav'; 
        
        sourceIndex = sourceIndex +1;
        pisteIndex = pisteIndex +1;
      };  
    };
    pisteIndex = 1;
    sourceIndex = 0;
  };

  source = sourceTemp[0];

	sequencer = new tm.Core();
  // track();
  var context = canvas.getContext('2d');
	function track() {
    	var canvas = document.getElementById('canvas');
    	var context = canvas.getContext('2d');
    	var tracker = new tracking.ColorTracker('yellow');

    	tracker.setMinDimension(5);

    	trackerTask = tracking.track('#video', tracker, { camera: true });	

    	//Tracking process
    	tracker.on('track', function(event) {
      	// context.clearRect(0, 0, canvas.width, canvas.height);
      	event.data.forEach(function(rect) {

      	});
      });  
    };
}