var BohrModel = {
	electronOrbits: '2,8,13,1',
	numOfElectronShells: 4,
	electrons: Array(2, 8, 13, 1),
	width: 500,
	height: 500,
	centerX: 250,
	centerY: 250,
	
	init: function()
	{
		this.width = $('#inspector #bohr-model').width() * 0.9;
		this.height = $('#inspector #bohr-model').height() * 0.8;
		
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;
		this.distanceBetweenShells = ((this.height / 2) - (7 * 2) - 5) / 7;
		this.canvas = $('<canvas />');
		this.canvas.attr('width', this.width);
		this.canvas.attr('height', this.height);
		$('#bohr-model').append(this.canvas);
	},
	
	load: function(whichElement)
	{
		if (!this.canvas)
			this.init();
		this.electrons = whichElement.electronOrbits.split(',');
		this.numOfElectronShells = this.electrons.length;
		this.draw();
	},

	draw: function()
	{
		var electrons = this.electrons;
		var numOfElectronShells = this.electrons.length - 1;
		var centerX = this.centerX;
		var centerY = this.centerY;
		var electronSize = this.distanceBetweenShells * 0.75;
		
		var ctx = this.canvas.get(0).getContext('2d');
		ctx.save();
		ctx.clearRect(0, 0, this.width, this.height);
		
		// Draw the nucleus
		var radgrad = ctx.createRadialGradient(
			centerX - (electronSize * 0.25), centerY - (electronSize * 0.25), 2,
			centerX,  centerY, electronSize * 1.2
		);
		radgrad.addColorStop(0, '#ff781e');
		radgrad.addColorStop(0.9, '#a51313');
		radgrad.addColorStop(1, '#222');
		ctx.beginPath();
		ctx.fillStyle = radgrad;
		ctx.arc(centerX, centerY, electronSize * 1.2, 0, Math.PI * 2, true);
		ctx.fill();

		for (var i = 0; i <= numOfElectronShells; i++)
		{ // Draw each electron shell
			var distanceFromCenter = (this.distanceBetweenShells * (i + 1)) + 10;
			
			// Highlight below electron shell
			ctx.beginPath();
			ctx.lineWidth = electronSize * 0.15;
			ctx.strokeStyle = '#222';
			ctx.arc(centerX, centerY, distanceFromCenter, 0, Math.PI*2, true);
			ctx.stroke();

			var spacing = 360 / this.electrons[i];
			var angle = 0;
			for (var xi = 0; xi < this.electrons[i]; xi++)
			{ // Draw each electron on this shell
				angle += spacing;
				var x = Math.cos(angle * Math.PI / 180) * distanceFromCenter;
				var y = Math.sin(angle * Math.PI / 180) * distanceFromCenter;
				
				var radgrad = ctx.createRadialGradient(
					centerX - (electronSize * 0.2) + x, centerY - (electronSize * 0.2) + y, 1,
					centerX + x,  centerY + y, (electronSize / 2)
				);
				radgrad.addColorStop(0, '#67a4d7');
				radgrad.addColorStop(1, '#222');
				ctx.beginPath();
				ctx.fillStyle = radgrad;
				ctx.arc(centerX + x, centerY + y, electronSize / 2, 0, Math.PI * 2, true);
				ctx.fill();
			}
		}
		
		ctx.restore();
	}
};
