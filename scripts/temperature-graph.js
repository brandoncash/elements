/**
	temperature-graph.js
	
	An interactive graph to select the temperature of the table.
*/

var TemperatureGraph = {
	currentTemp: 20,
	startTemp: -300, // Lowest is -272
	endTemp: 5700, // Highest is 5660

	// Initialize the temperature graph
	init: function()
	{
		this.createCanvas();
		this.draw();

		$('#controls-temperature').bind('mousedown mousemove touchstart touchmove', this.onTouch);
	},
	
	// Create a new canvas to draw on
	createCanvas: function()
	{
		this.width = $('#temperature-graph').width();
		this.height = $('#temperature-graph').height();

		this.canvas = $('<canvas />');
		var ctx = this.canvas.get(0).getContext('2d');
		ctx.save();

		this.canvas.attr('width', this.width * 2);
		this.canvas.attr('height', this.height * 2);
		this.canvas.css(
		{
			width: this.width + 'px',
			height: this.height + 'px'
		});
		$('#temperature-graph').append(this.canvas);
	},
	
	// Draw the graph
	draw: function()
	{
		var ctx = this.canvas.get(0).getContext('2d');
		ctx.save();
		ctx.scale(2, 2);
		ctx.clearRect(0, 0, this.width, this.height);

		this.drawBackground(ctx);
		this.drawForeground(ctx);
		
		ctx.restore();
	},

	// Draw the background
	drawBackground: function(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(0, this.height); // Bottom left corner
		ctx.lineTo(this.width, 0); // Top right corner
		ctx.lineTo(this.width, this.height); // Bottom right corner
		
		// Fill with a dull gradient
		var backGradient = ctx.createLinearGradient(0, 0, this.width, 0);
		backGradient.addColorStop(0, 'rgba(24, 198, 248, 0.3)');
		backGradient.addColorStop(0.25, 'rgba(37, 127, 255, 0.3)');
		backGradient.addColorStop(0.5, 'rgba(221, 195, 1, 0.3)');
		backGradient.addColorStop(0.75, 'rgba(226, 137, 87, 0.3)');
		backGradient.addColorStop(1, 'rgba(224, 60, 61, 0.3)');
		ctx.fillStyle = backGradient;
		ctx.fill();
		ctx.closePath();
	},

	// Draw the foreground
	drawForeground: function(ctx)
	{		
		ctx.beginPath();

		// Figure out where the point sits on the line
		var position = (Table.currentTemp - this.startTemp)  / (this.endTemp - this.startTemp);
		var pointOnLine = {
			x: (this.width * position),
			y: this.height - this.height * position
		};
		
		// The main graph shape
		ctx.moveTo(0, this.height); // Bottom left corner
		ctx.lineTo(pointOnLine.x, pointOnLine.y); // Top right corner
		ctx.lineTo(pointOnLine.x, this.height); // Bottom right corner

		// Fill with a bright gradient
		var tempGradient = ctx.createLinearGradient(0, 0, this.width, 0);
		tempGradient.addColorStop(0, 'rgba(24, 198, 248, 1)');
		tempGradient.addColorStop(0.25, 'rgba(37, 127, 255, 1)');
		tempGradient.addColorStop(0.5, 'rgba(221, 195, 1, 1)');
		tempGradient.addColorStop(0.75, 'rgba(226, 137, 87, 1)');
		tempGradient.addColorStop(1, 'rgba(224, 60, 61, 1)');
		ctx.fillStyle = tempGradient;
		ctx.fill();

		// Draw a line along the right side
		ctx.beginPath();
		ctx.moveTo(pointOnLine.x, pointOnLine.y); // Top right
		ctx.lineTo(pointOnLine.x, this.height);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#d1347f';
		ctx.stroke();
		ctx.closePath();
	},

	// Update the table temperature (table.js) on touch
	onTouch: function(e)
	{
		if ((e.type == 'mousemove') && (e.which != 1)) // The mouse is moving, but we're not dragging
			return;
		var posX = $('#temperature-graph').offset().left;
		if (typeof(e.pageX) == 'undefined') // We are using a touch device
			e.pageX = e.originalEvent.targetTouches[0].pageX;
		var position = (e.pageX - posX) / TemperatureGraph.width; // Normalized percentage of click position
		var newTemp = Math.round(((TemperatureGraph.endTemp - TemperatureGraph.startTemp) * position) + TemperatureGraph.startTemp);
		newTemp = Math.round(newTemp / 10) * 10; // Round to the nearest 10
		
		Table.changeTemp(newTemp);
	}
};
