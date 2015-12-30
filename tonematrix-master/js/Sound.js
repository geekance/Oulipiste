var Sound = (function () {
	
	/**
	 * @constructor
	 * @param {AudioContext} context
	 * @param {AudioBuffer} buffer
	 */
	function Sound (context, buffer, masterVolumeNode, offset) {
		
		this.context = context;
		this.buffer = buffer;
		this.offset = offset;
		this.masterVolumeNode = masterVolumeNode;
		this.trackVolumeNode = context.createGain();
		// this.buffer = context.createBufferSource();
		// this.buffer.buffer = buffer;
		// this.trackVolumeNode = context.createGain();
		// this.buffer.connect(this.trackVolumeNode);

		// this.trackVolumeNode.connect(masterVolumeNode);
		// masterVolumeNode.connect(context.destination);

		this.setEnableSound(false);
	}
	
	Sound.prototype = {
		/**
		 * Plays sound
		 * @returns {undefined}
		 */
		play: function () {
			if (this.enableSound === true) {
				this.source = this.context.createBufferSource();
				this.source.buffer = this.buffer;
				this.source.connect(this.trackVolumeNode);
				this.trackVolumeNode.connect(this.masterVolumeNode);
				this.source.connect(this.context.destination);
				this.source.start(0, this.offset);
			}
		},
		/**
		 * @param {Boolean} value
		 * @returns {undefined}
		 */
		setEnableSound: function (value) {
			this.enableSound = value;
		}
	};
	
	return Sound;
}());