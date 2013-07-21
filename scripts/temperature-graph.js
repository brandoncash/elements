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

		$(this.canvas).click(this.onTouch);
	},
	
	// Create a new canvas to draw on
	createCanvas: function()
	{
		this.width = $('#temperature-graph').width();
		this.height = $('#temperature-graph').height();

		this.paddingSize = this.height * 0.05;

		this.canvas = $('<canvas />');
		this.canvas.attr('width', this.width);
		this.canvas.attr('height', this.height);
		$('#temperature-graph').append(this.canvas);
	},
	
	// Draw the graph
	draw: function()
	{
		var ctx = this.canvas.get(0).getContext('2d');
		ctx.save();
		ctx.clearRect(0, 0, this.width, this.height);

		this.drawBackground(ctx);
		this.drawForeground(ctx);
		
		ctx.restore();
	},

	// Draw the background
	drawBackground: function(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(this.paddingSize, this.height - this.paddingSize); // Bottom left corner
		ctx.lineTo(this.width - this.paddingSize, this.paddingSize); // Top right corner
		ctx.lineTo(this.width - this.paddingSize, this.height - this.paddingSize); // Bottom right corner
		
		// Fill with a dull gradient
		var backGradient = ctx.createLinearGradient(0, 0, this.width, 0);
		backGradient.addColorStop(0, 'rgba(110, 216, 250, 0.2)');
		backGradient.addColorStop(0.25, 'rgba(39, 101, 219, 0.2)');
		backGradient.addColorStop(0.5, 'rgba(255, 241, 54, 0.2)');
		backGradient.addColorStop(0.75, 'rgba(244, 101, 61, 0.2)');
		backGradient.addColorStop(1, 'rgba(255, 61, 70, 0.2)');
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
			x: ((this.width - (this.paddingSize * 2)) * position) + this.paddingSize,
			y: this.height - ((this.height - (this.paddingSize * 2)) * position) - this.paddingSize
		};
		
		// The main graph shape
		ctx.moveTo(this.paddingSize, this.height - this.paddingSize); // Bottom left corner
		ctx.lineTo(pointOnLine.x, pointOnLine.y); // Top right corner
		ctx.lineTo(pointOnLine.x, this.height - this.paddingSize); // Bottom right corner

		// Draw a drop shadow
		ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
		ctx.shadowBlur = 1;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 1;
		
		// Fill with a bright gradient
		var tempGradient = ctx.createLinearGradient(0, 0, this.width, 0);
		tempGradient.addColorStop(0, 'rgba(110, 216, 250, 1)');
		tempGradient.addColorStop(0.25, 'rgba(39, 101, 219, 1)');
		tempGradient.addColorStop(0.5, 'rgba(255, 241, 54, 1)');
		tempGradient.addColorStop(0.75, 'rgba(244, 101, 61, 1)');
		tempGradient.addColorStop(1, 'rgba(255, 61, 70, 1)');
		ctx.fillStyle = tempGradient;
		ctx.fill();

		// Draw a highlight on the top
		ctx.beginPath();
		ctx.moveTo(this.paddingSize, this.height - this.paddingSize + 1);
		ctx.lineTo(pointOnLine.x, pointOnLine.y + 1);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.stroke();
		ctx.closePath();

		// Draw a line along the right side
		ctx.beginPath();
		ctx.moveTo(pointOnLine.x, pointOnLine.y + (this.paddingSize / 2)); // Top right
		ctx.lineTo(pointOnLine.x, this.height - this.paddingSize);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#7693b1';
		ctx.stroke();
		ctx.closePath();

		// Draw a circle at the top of the graph
		ctx.beginPath();
		ctx.arc(pointOnLine.x, pointOnLine.y, this.paddingSize, 0, Math.PI * 2, true);
		ctx.fillStyle = '#67f176';
		ctx.fill();
	},

	// Update the table temperature (table.js) on touch
	onTouch: function(e)
	{
		var position = (e.offsetX / this.width); // Normalized percentage of click position
		var newTemp = Math.round(((TemperatureGraph.endTemp - TemperatureGraph.startTemp) * position) + TemperatureGraph.startTemp);
		newTemp = Math.round(newTemp / 10) * 10; // Round to the nearest 10
		Table.changeTemp(newTemp);
	}
};
