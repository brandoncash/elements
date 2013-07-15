var TemperatureGraph = {
	currentTemp: 20,
	startTemp: -300, // Lowest is -272
	endTemp: 5700, // Highest is 5660

	init: function()
	{
		this.createCanvas();
		this.draw();

		$(this.canvas).click(this.onTouch);
	},
	
	createCanvas: function()
	{
		this.width = $('#temperature-graph').width();
		this.height = $('#temperature-graph').height();

		this.arcRadius = this.height / 10;

		this.canvas = $('<canvas />');
		this.canvas.attr('width', this.width);
		this.canvas.attr('height', this.height);
		$('#temperature-graph').append(this.canvas);
	},
	
	draw: function()
	{
		var ctx = this.canvas.get(0).getContext('2d');
		ctx.save();
		ctx.clearRect(0, 0, this.width, this.height);

		this.drawBackground(ctx);
		this.drawForeground(ctx);
		
		ctx.restore();
	},

	drawBackground: function(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(0, this.height - 1); // Bottom left corner
		ctx.lineTo(this.width, 0); // Top right corner
		ctx.lineTo(this.width, this.height - 1 - this.arcRadius); // Bottom right corner
		ctx.arcTo(this.width, this.height - 1, this.width - this.arcRadius, this.height - 1, this.arcRadius); // Rounded corner
		
		// Fill with a dull gradient
		var backGradient = ctx.createLinearGradient(0, 0, this.width, 0);
		backGradient.addColorStop(0, 'rgba(102, 153, 204, 0.3)');
		backGradient.addColorStop(0.25, 'rgba(0, 102, 204, 0.3)');
		backGradient.addColorStop(0.5, 'rgba(253, 194, 15, 0.3)');
		backGradient.addColorStop(0.75, 'rgba(255, 102, 0, 0.3)');
		backGradient.addColorStop(1, 'rgba(183, 0, 0, 0.3)');
		ctx.fillStyle = backGradient;
		ctx.fill();
		ctx.closePath();
	},

	drawForeground: function(ctx)
	{		
		ctx.beginPath();
		ctx.moveTo(0, this.height - 1); // Bottom left corner

		// Figure out where the point sits on the line
		var position = (Table.currentTemp - this.startTemp)  / (this.endTemp - this.startTemp);
		var pointOnLine = {
			x: this.width * position,
			y: this.height - 1 - (this.height * position)
		};

		// Draw the bottom right corner
		ctx.lineTo(pointOnLine.x, pointOnLine.y); // Top right corner
		if ((this.height - pointOnLine.y) > this.arcRadius)
			ctx.arcTo(pointOnLine.x, this.height - 1, 0, this.height - 1, this.arcRadius);
		else // Not enough room for full roundness, so scale down
			ctx.arcTo(pointOnLine.x, this.height - 1, 0, this.height - 1, (this.height - pointOnLine.y));
		ctx.lineTo(0, this.height - 1); // Bottom left corner
		
		// Fill with a bright gradient
		var tempGradient = ctx.createLinearGradient(0, 0, this.width, 0);
		tempGradient.addColorStop(0, 'rgba(102, 153, 204, 1)');
		tempGradient.addColorStop(0.25, 'rgba(0, 102, 204, 1)');
		tempGradient.addColorStop(0.5, 'rgba(253, 194, 15, 1)');
		tempGradient.addColorStop(0.75, 'rgba(255, 102, 0, 1)');
		tempGradient.addColorStop(1, 'rgba(183, 0, 0, 1)');
		ctx.fillStyle = tempGradient;
		ctx.fill();

		// A bit of a shadow
		var backGradient = ctx.createLinearGradient(0, 0, 0, this.height);
		backGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		backGradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.25)');
		backGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
		ctx.fillStyle = backGradient;
		ctx.fill();
		ctx.closePath();

		// Draw a highlight at the top
		ctx.beginPath();
		ctx.moveTo(0, this.height + 1); // Bottom left
		ctx.lineTo(pointOnLine.x, pointOnLine.y + 1); // Top right
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.stroke();
		ctx.closePath();

		// And a shadow at the bottom
		ctx.beginPath();
		ctx.lineTo(pointOnLine.x, pointOnLine.y); // Top right corner
		if ((this.height - pointOnLine.y) > this.arcRadius)
			ctx.arcTo(pointOnLine.x, this.height - 1, 0, this.height - 1, this.arcRadius);
		else // Not enough room for full roundness, so scale down
			ctx.arcTo(pointOnLine.x, this.height - 1, 0, this.height - 1, (this.height - pointOnLine.y));
		ctx.lineTo(0, this.height - 1); // Bottom left corner
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.stroke();
		ctx.closePath();
	},

	onTouch: function(e)
	{
		var position = (e.offsetX / this.width); // Normalized percentage of click position
		var newTemp = Math.round(((TemperatureGraph.endTemp - TemperatureGraph.startTemp) * position) + TemperatureGraph.startTemp);
		newTemp = Math.round(newTemp / 10) * 10; // Round to the nearest 10
		Table.changeTemp(newTemp);
	}
};
