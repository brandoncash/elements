/**
	bohrmodel.js
	
	A Bohr model diagram of the current element.
*/

var BohrModel = {
	electronOrbits: '2,8,13,1',
	numOfElectronShells: 4,
	electrons: Array(2, 8, 13, 1),
	
	// Create a new canvas to work with.
	createCanvas: function()
	{
		this.width = $('#bohr-model').width() * 0.9;
		this.height = $('#bohr-model').height() * 0.8;
		
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;
		this.distanceBetweenShells = ((this.height / 2) - (7 * 2) - 5) / 7; // FIXME: crazy maths
		
		this.canvas = $('<canvas />');
		this.canvas.attr('width', this.width);
		this.canvas.attr('height', this.height);
		$('#bohr-model').append(this.canvas);
	},
	
	// Load a new element's information and update the Bohr model
	load: function(whichElement)
	{
		if (!this.canvas)
			this.createCanvas();
		this.electrons = whichElement.electronOrbits.split(',');
		this.numOfElectronShells = this.electrons.length;
		this.draw();
	},

	// Draw the Bohr model
	draw: function()
	{
		var electrons = this.electrons;
		var numOfElectronShells = this.electrons.length - 1;
		var centerX = this.centerX;
		var centerY = this.centerY;
		var electronSize = this.distanceBetweenShells * 0.65;
		
		var ctx = this.canvas.get(0).getContext('2d');
		ctx.save();
		ctx.clearRect(0, 0, this.width, this.height);
		
		// Draw the nucleus
		ctx.beginPath();
		ctx.fillStyle = '#FF3D46';
		ctx.arc(centerX, centerY, electronSize, 0, Math.PI * 2, true);
		ctx.fill();

		for (var i = 0; i <= numOfElectronShells; i++)
		{ // Draw each electron shell
			var distanceFromCenter = (this.distanceBetweenShells * (i + 1)) + 10;
			
			// The electron shell
			ctx.beginPath();
			ctx.lineWidth = electronSize * 0.15;
			ctx.strokeStyle = '#61666d';
			ctx.arc(centerX, centerY, distanceFromCenter, 0, Math.PI*2, true);
			ctx.stroke();

			var spacing = 360 / this.electrons[i];
			var angle = 0;
			for (var xi = 0; xi < this.electrons[i]; xi++)
			{ // Draw each electron on this shell
				angle += spacing;
				var x = Math.cos(angle * Math.PI / 180) * distanceFromCenter;
				var y = Math.sin(angle * Math.PI / 180) * distanceFromCenter;
				
				ctx.beginPath();
				ctx.arc(centerX + x, centerY + y, electronSize / 2, 0, Math.PI * 2, true);
				ctx.fillStyle = '#67f176';
				ctx.fill();
			}
		}
		
		ctx.restore();
	}
};
