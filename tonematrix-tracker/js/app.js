if (!window.webkitAudioContext)
{
	alert('No WebAudio support');
}
else
{
  var trackerTask;

  tracking.ColorTracker.registerColor('red', function(r, g, b) {

    if (r > 190 && g < 80 && b < 80) {
      return true;
    }
    return false;

  });
  tracking.ColorTracker.registerColor('yelloWhite', function(r, g, b) {

    if (r > 100 && g > 100 && b > 100) {
      return true;
    }
    return false;

  });
  // tracking.ColorTracker.registerColor('led', function(r, g, b) {

  //   if ((r > 220 && g > 120 && b > 10) && (r < 245 && g < 140 && b < 50)) {
  //     return true;
  //   }
  //   return false;

  // });
  localStorage.setItem("buzz","false");
  

  track();

  function setListenToBuzzer() {
    setTimeout(function ()
    {
      localStorage.setItem("ListenToBuzzer","true");
    }, 60000);

  };

	function track() {

    	var canvas = document.getElementById('canvas');
    	var context = canvas.getContext('2d');
    	var tracker = new tracking.ColorTracker(['yellow', 'red', 'yelloWhite']);


    	tracker.setMinDimension(5);

    	trackerTask = tracking.track('#video', tracker, { camera: true });	

    	//Tracking process
    	tracker.on('track', function(event) {
    		//Clear all tacking rectangles and cubes created on the previous frame
      	context.clearRect(0, 0, canvas.width, canvas.height);
      	//clearCubesOnScene();
        // sequencer.toggleNoteOff();

      	//At the position of each tracking rectangle, create a cube
        localStorage.setItem("rect",JSON.stringify(event.data));
        // localStorage.setItem("clean","true");
        console.log(event);
      	event.data.forEach(function(rect) {
          context.strokeStyle = rect.color;
          rect.x = rect.x +100;
          rect.y = rect.y +164; 
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
          // control.log(rect)
          // context.fillText('r: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          // context.fillText('g: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
          // context.fillText('b: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

          if ((rect.color == "red") && (localStorage.getItem("ListenToBuzzer") == "true")){
            localStorage.setItem("buzz","true");
            localStorage.setItem("ListenToBuzzer","false");
            // setListenToBuzzer();

            console.log(event.data);
            // console.log(document.elementFromPoint(rect.x, rect.y))
            // localStorage.setItem("rect.x",rect.x);
            // localStorage.setItem("rect.y",rect.x);
            // localStorage.setItem("clean","false");
            // document.elementFromPoint(rect.x, rect.y).click(); 
            // console.log("clicked")
          }
          
        		// displayCubes(rect.x, rect.y);
      	});
      });  
    };

}