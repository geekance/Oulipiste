(function ()
{
	'use strict';
	var Core = tm.Class(
	{

		BPM: 120, //Sets the BPM of the sequencer
		ROWS: 4,  //Number of row or number of circle
		COLUMNS: 8, //Number of column of number of circle divisions
		grid: [], //2 dimension array: grid[ROWS][COLUMNS]. Initialized by generateGrid(). Is used to detect if a cell is active
		sounds: [], //2 dimension array: sounds[ROWS][COLUMNS]. Initialized by loadSounds(). Is used to contain all samples from the active instument
		recordings: [], //1 dimension array: recordings[0]. Initialized by 
		noteIndex: 0,
		recorder: 0,
		nbLoopsCount: 0,
		tracking: istracking() === 'true',
		detectBuzz: isdetectingbuzz() === 'true',
		isManual: ismanual() === 'true',
		recordIndexPlayed: 0,
		recordIndexPlayedName: 0,
		recordLoop: false,
		record: false,
		load: false,
		playLoop: false,
		changeInstru: false,
		reloadeInstru: false,
		isOnfirstInstru: false,
		isActive: false,
		indexActiveColor: 0,
		nbToursNotActive: 0,
		// stepBetweenArc: 100, /*Setp between each arcs on the same column*/
		audioContext: new AudioContext(),

		recorderInit: function (masterVolumeNode,masterRecorderNode)
		{
			masterVolumeNode = this.audioContext.createGain();
			// console.log(this.audioContext);
			masterRecorderNode = new Recorder(this.masterVolumeNode);

		},

		recordStart: function (masterRecorderNode)
		{
			masterRecorderNode.record();

		},

		recordStop: function (masterRecorderNode)
		{
			masterRecorderNode.stop();


		},

		saveRecordAsWav: function (masterRecorderNode,fileName) {
	        masterRecorderNode.exportWAV(function (blob) {
	            // clearLog();
	            // log("Saved mix!");
	            // log("file: " + fileName);
	            Recorder.forceDownload(blob, fileName);
	        });
	        masterRecorderNode.clear();
	        // could get mono instead by saying
	        // audioRecorder.exportMonoWAV( doneEncoding );
    	},

		getSetpBetweenArcs: function (circleSize)
		{
			this.stepBetweenArc = 64;
			return this.stepBetweenArc
		},

		constructor: function (opts)
		{

			for (var i = 0; i < this.ROWS; i++)
			{
				var columns = [];
				for (var j = 0; j < this.COLUMNS; j++)
				{		
					columns.push(j);
				}
				this.sounds.push(columns);
			}

			columns = [];
			columns.push(0);
			this.masterVolumeNode = this.audioContext.createGain();
			this.masterRecorderNode = new Recorder(this.masterVolumeNode);

			this.masterRecorderNodeSession = new Recorder(this.masterVolumeNode);

			this.recorderInit(this.masterVolumeNode,this.masterRecorderNode);
			this.recorderInit(this.masterVolumeNodeSession,this.masterRecorderNodeSession);

			this.firstLoading(source);
			// console.log(this.sounds);
			

			this.startLoop();
			this.events();
			
		},

		track: function () 
		{
	        this.toggleNoteOff();
	        // At the position of each tracking rectangle, create a cube
	        context.clearRect(0, 0, canvas.width, canvas.height);
	        JSON.parse(localStorage.getItem("rect")).forEach(function(rect) {

	          rect.x = rect.x +320;
	          rect.y = rect.y +150;	
	          context.strokeStyle = rect.color;
	       // context.strokeRect(rect.x, rect.y, rect.width, rect.height);

	         context.beginPath();
	         context.arc(rect.x + (rect.width/2),rect.y + (rect.height/2),rect.width,0,2*Math.PI);
	         context.closePath();
	         context.stroke

	          // context.font = '11px Helvetica';
	          // context.fillStyle = "#fff";
	          // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
	          // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

	          if (document.elementFromPoint(rect.x, rect.y) != null){
	          	if (document.elementFromPoint(rect.x, rect.y).className.indexOf("active") == -1)
	          	{
	          		document.elementFromPoint(rect.x, rect.y).click(); 
	          	};
	            

	          }
	          
	        }); 
    	},

		startLoop: function ()
		{
			clearInterval(this.loop);
			this.loop = setInterval(this.audioLoop.bind(this), 60 / this.BPM / 2 * 1000);
		},

		stopLoop: function ()
		{
			clearInterval(this.loop);
			this.loop = null;
		},

		setBpm: function (bpm)
		{
			this.BPM = bpm;
			localStorage.setItem('bpm', bpm);
			this.startLoop();
		},

		firstLoading: function (source) {

			this.loadSounds(source);
			this.loadApp();
		},

		reloadSounds: function (source) {
			for (var i = 0; i < this.ROWS; i++)
		    {
		      for (var j = 0; j < this.COLUMNS; j++)
		      {
			    if (this.isOnfirstInstru) {
					this.recordingDetectedRemove(tm.$(i + '' + j))
				}
		        this.reloadSoundsAnim(tm.$(i + '' + j))
		      }
		    }
			// this.stopLoop();
			this.loadSounds(source);
			// this.startLoop();
		},

		reloadSoundsAnim: function (note) {
			var indexActiveColor = this.indexActiveColor;
			note.classList.add('active' + this.indexActiveColor);
			setTimeout(function ()
			{
				note.classList.remove('active' + indexActiveColor);
			}, Math.random()*600 +500);

		},

		buzzDetected: function (note, noteIsActive) {
	
			note.classList.add('buzzed');
			setTimeout(function ()
			{
				note.classList.remove('buzzed');
			}, Math.random()*600 +500);

		},
		
		recordingDetectedAdd: function (note, noteIsActive) {
			if (!noteIsActive){
				note.classList.add('recording');
			}
			
		},
		
		recordingDetectedRemove: function (note) {
			note.classList.remove('recording');
		},

		loadSounds: function (source) {

			var _this = this,
				bufferLoader = new BufferLoader (this.audioContext, source, function (bufferList) {

					var rowSounds = -1;
					_this.bufferList = bufferList;
					// console.log(bufferList);
					bufferList.forEach(function (audioBuffer, rowIndex) {

						// push new sound row and create columns
						var colSounds = rowIndex%(_this.COLUMNS);
						
						if (!colSounds) {
							rowSounds = rowSounds +1;
						};
						_this.sounds[rowSounds][colSounds] = new Sound(_this.audioContext, audioBuffer, _this.masterVolumeNode, 0);
					});
					
				});

			bufferLoader.load();
		},

		loadRecording: function () {
			// console.log(sourceRecordings);
			Recordings[0] = this.recordIndexPlayed;
			// console.log(Recordings);

			var _this = this,
				bufferLoader = new BufferLoader (this.audioContext, Recordings, function (bufferList) {

					
					bufferList.forEach(function (audioBuffer, rowIndex) {
						
						_this.recordings[0] = new Sound(_this.audioContext, audioBuffer, _this.masterVolumeNode, 0.049);//0.047
						_this.recordings[0].setEnableSound(true)
						// _this.recordings[0].play();
						// console.log(_this.recordings[0]);

					});
					
				});

			// _this.recordings[0].setEnableSound(true);
			bufferLoader.load();
		},

		loadApp: function () {

			this.generateGrid();

		},

		isActiveGrid: function () {

			for (var i = 0; i < this.ROWS; i++)
			{
				for (var j = 0; j < this.COLUMNS; j++)
				{
					if (this.grid[i][j]) {
						return true;
					};
						
				}
			}
			return false;
		},

		toggleNote: function (e, state)
		{

			if(e.target.id != 'tonematrix') {
				var row = e.target.getAttribute('data-row');
				var column = e.target.getAttribute('data-column');
				var note = state !== undefined ? state : this.grid[row][column];
				var action = note ? 'remove' : 'add';

				this.grid[row][column] = +!note;
				// console.log(action);
				// console.log(this.playLoop);
				if ((action == 'add') && this.isOnfirstInstru){
					this.recordingDetectedRemove(e.target);
				}
				else if ((action == 'remove') && this.isOnfirstInstru){
					this.recordingDetectedAdd(e.target);
				}
				// this.recordingDetectedRemove(e.target);
				e.target.classList[action]('active' + this.indexActiveColor);
				this.sounds[row][column].setEnableSound(true);
			}
		},

		toggleNoteOff: function (state)
		{
			for (var i = 0; i < this.ROWS; i++)
			{
				for (var j = 0; j < this.COLUMNS; j++)
				{

					var note = this.grid[i][j];
					if (note) {
						var noteHtml = document.getElementById(''+i+j+'');
						noteHtml.classList['remove']('active' + this.indexActiveColor);
						this.grid[i][j] = +!note;
						this.sounds[i][j].setEnableSound(false);
						
					};
					
				}
			}
		},

		highlightNote: function (note)
		{
			note.classList.add('light');
			setTimeout(function ()
			{
				note.classList.remove('light');
			}, 200);
		},

		reloadSession: function ()
		{
			this.isOnfirstInstru = true;
			this.toggleNoteOff();
	        // sequencer.indexActiveColor = 0;
	        this.recordStop(sequencer.masterRecorderNodeSession); 

	        this.saveRecordAsWav(sequencer.masterRecorderNodeSession, "session" + readXMLSessionId() + ".wav"); 
	        writeXMLSessionId(Number(readXMLSessionId()) +1);

	        sourceIndex = 0;
	        this.recordIndexPlayed = sourceIndex;
	        this.recordIndexPlayedName = sourceIndex;
	        this.playLoop = false;
	        source = sourceTemp[sourceIndex];
	      
	      	for (var i = 0; i < this.ROWS; i++)
	      	{
	        	for (var j = 0; j < this.COLUMNS; j++)
	        	{
	          		this.buzzDetected(tm.$(i + '' + j));
	        	}
	      	}
		},

		handleEvent: function (e)
		{
			if (e.target.classList && e.target.classList.contains('note'))
			{	

				if (e.type === 'mousedown')
				{
					this.dragging = true;
					this.noteIsActive = e.target.classList.contains('active' + this.indexActiveColor);
				}
				if (e.type === 'mousemove')
				{
					if (this.dragging)
					{
						this.toggleNote(e, this.noteIsActive);
					}
				}
			}
			if (e.type === 'mouseup')
			{
				this.dragging = false;
				localStorage.setItem('notes', tm.encode(this.grid));
			}
		},
			
		audioLoop: function ()
		{

			var date = new Date();
			var currentTime = this.audioContext.currentTime - this.startTime;

			if (this.tracking) {
				this.track();	
			};
			

			if (this.noteIndex === this.COLUMNS -1)
			{
				// console.log("his.isActiveGrid: "+this.isActiveGrid(), " sourceIndex: " + sourceIndex);
				
				if ((!this.isActiveGrid()) && (sourceIndex != 0) && (this.nbToursNotActive == 2)) {	
					sequencer.changeInstru = true;
					this.reloadSession();
					this.nbToursNotActive = 0;
				};
				if ((!this.isActiveGrid()) && (sourceIndex != 0)) {
					this.nbToursNotActive = this.nbToursNotActive +1;
				}
				else if (this.isActiveGrid()){
					this.nbToursNotActive = 0;
				};

				if (this.reloadeInstru) {
					this.toggleNoteOff();
					this.indexActiveColor = sourceIndex; 
					this.reloadSounds(source);
					this.reloadeInstru = false;
					

				};

				if (this.playLoop) {
					this.isOnfirstInstru = false;
					this.recordings[0].play();
				};
			
				if (this.changeInstru) {
					this.toggleNoteOff();
					this.indexActiveColor = sourceIndex; 
					this.reloadSounds(source);
					this.changeInstru = false;
					
				}; 

				if (this.load) {
					this.load = false;
					this.loadRecording();
					sequencer.recordStart(sequencer.masterRecorderNodeSession);
					this.playLoop = true;
					this.reloadeInstru = true;
				};

				if (this.recordLoop && !this.record) {
						this.isOnfirstInstru = true;
						this.record = true;
						this.recordStart(this.masterRecorderNode); 

				}

				else if (this.recordLoop && this.record) {

						this.record = false;

						this.recordLoop = false;
						this.load = true;
						this.recordStop(this.masterRecorderNode); 
						this.saveRecordAsWav(this.masterRecorderNode, this.recordIndexPlayedName); 
				}
				
			}

			for (var i = 0; i < this.grid.length; i++)
			{
				
				if (this.grid[i][this.noteIndex])
				{
					this.hitNote(tm.$(i + '' + this.noteIndex));
					this.sounds[i][this.noteIndex].play();
				}
				else
				{
					this.highlightNote(tm.$(i + '' + this.noteIndex));
				}

			}

			

			for (var i = 0; i < this.grid.length; i++)
			{	
				for (var j = 0; j < this.COLUMNS; j++)
				{
					if (this.noteIndex >= j) { 
						var temp = this.COLUMNS - this.noteIndex-1 +j	
						temp = temp/this.COLUMNS;
					}
					else{
						var temp =  j - (this.noteIndex+1);
						temp = temp/this.COLUMNS;
					};

				    if(tm.$(i + '' + j).className.match("note active" + this.indexActiveColor)) {
				        tm.$(i + '' + j).style.opacity = 1;
				    }
				    else{
				    	if (localStorage.getItem("ListenToBuzzer") == "true") {
				    		document.getElementById("circle").style.background = "-webkit-radial-gradient(center center,40px 40px, #470000 36%,rgba("+ instuColors[this.indexActiveColor] +"," + temp +") 17%,rgba("+ instuColors[this.indexActiveColor] +"," + temp +") 50%,#000000 77%,  transparent)";
				    	}else{
				    		document.getElementById("circle").style.background = "-webkit-radial-gradient(center center,90px 90px ,rgba("+ instuColors[this.indexActiveColor] +"," + temp +"), transparent, transparent)";
				    	};
				    	
				    };
				}
			}
			this.noteIndex++;


			if (this.noteIndex === this.COLUMNS)
			{
				this.noteIndex = 0;

			};	
		},

		changeInstrument: function(e){
		    // if (localStorage.getItem("ListenToBuzzer") == "false") {
		    //   return;
		    // };
		    if (((localStorage.getItem("buzz") == "true") && this.detectBuzz ) || (e.type == "keydown" && this.isManual)){

		      localStorage.setItem("ListenToBuzzer","false");
		      setTimeout(function ()
		      {
		        localStorage.setItem("ListenToBuzzer","true");
		        
		      }, 6000);

		      if (sourceIndex == 0) {
		        this.recordLoop = true;
		        this.recordIndexPlayed = sourceRecordings + sourceIndex + ".wav";
		        this.recordIndexPlayedName = "filename" + sourceIndex + ".wav";
		        // sequencer.changeInstru = true; 
		      }
		      else{
		        this.changeInstru = true;  
		      };
		    
			  
			  if (sourceIndex == 0) {
		        for (var i = 0; i < this.ROWS; i++)
				  {
					for (var j = 0; j < this.COLUMNS; j++)
					{
					  this.recordingDetectedAdd(tm.$(i + '' + j),this.grid[i][j]);
					}
				  }
		      }
			  else{
				  for (var i = 0; i < this.ROWS; i++)
				  {
					for (var j = 0; j < this.COLUMNS; j++)
					{
					  this.buzzDetected(tm.$(i + '' + j))
					}
				  }
			  }
			  
		      sourceIndex = sourceIndex +1
		      if (sourceIndex == sourceTemp.length) {
		        sourceIndex = 1;
		      };
		      source = sourceTemp[sourceIndex];
		      
			  
		      
			  
			  
		      localStorage.setItem("buzz","false");
		    }
	    },

		hitNote: function (note)
		{
			var indexActiveColor = this.indexActiveColor;
			note.classList.remove('active' + this.indexActiveColor);
			note.classList.add('hit');
			setTimeout(function ()
			{
				note.classList.add('active' + indexActiveColor);
				note.classList.remove('hit');
				// console.log(indexActiveColor);
			}, 200);
		},

		generateGrid: function ()
		{
			var stepBetweenArc = this.getSetpBetweenArcs(500);
			var stepBetweenArcInit = -15;
			var topMax = -1*(this.ROWS*stepBetweenArc) + stepBetweenArc;
			var rotationStep = 45;
			var rotationInit = 1;

			var note;
			var tmpGrid = tm.decode(window.location.hash.slice(1) || localStorage.getItem('notes')) || [];

			for (var i = 0; i < this.ROWS; i++)
			{
				this.grid[i] = [];
				for (var j = 0; j < this.COLUMNS; j++)
				{

					this.grid[i].push(0);
				    note = document.createElement('div');
					note.id = i + '' + j;
				    note.style.cssText = 'px; top: ' + (topMax + stepBetweenArcInit + i*stepBetweenArc) + 'px; left: ' + (topMax + stepBetweenArcInit + i*stepBetweenArc) + 'px';
					note.setAttribute('data-row', i);
					note.setAttribute('data-column', j);
					note.style.transform = 'rotate(' + j*rotationStep + 'deg) skewX(46deg)'; 
					note.classList.add('note');

					tm.$('tonematrix').appendChild(note);
					
					
				}
			}
		},

		events: function ()
		{
			tm.$('tonematrix').on('click', this.toggleNote.bind(this), false);
			// window.addEventListener('keydown', this.reloadSounds(source), false);
			tm.$('tonematrix').on('mousedown', this, false);
			tm.$('tonematrix').on('mousemove', this, false);
			// tm.$('tonematrix').on('click', this, false);
			window.addEventListener('click', this, false);
			window.addEventListener('mouseup', this, false);
			window.addEventListener('blur', this.stopLoop.bind(this), false);
			window.addEventListener('focus', this.startLoop.bind(this), false);
			window.addEventListener('keydown', this.changeInstrument.bind(this), false);
 			window.addEventListener("storage", this.changeInstrument.bind(this), false);
		}
	});

	tm.Core = Core;

})();
