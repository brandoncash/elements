/**
	discovery-graph.js
	
	An interactive graph to select the current discovery year.
*/

var DiscoveryGraph = {
	firstYear: 1745,
	lastYear: 2010,
	newDiscovered: [],
	numberDiscovered: [],

	// Initialize the graph	
	init: function()
	{
		// Build an array of how many were discovered by that year
		var yearAccrue = 0;
		for (var curElement = 1; curElement <= 118; curElement++)
		{
			var year = periodicElements[curElement].yearDiscovered;
			if (!this.newDiscovered[year])
				this.newDiscovered[year] = 0;
			this.newDiscovered[year] += 1;
			if (year <= this.firstYear)
			{ // Really old discoveries
				yearAccrue += 1;
			}
		}

		// Now put it in a usable format
		for (var curYear = this.firstYear; curYear <= this.lastYear; curYear++)
		{
			if (this.newDiscovered[curYear])
				yearAccrue += this.newDiscovered[curYear];
			else
				this.newDiscovered[curYear] = 0;

			this.numberDiscovered[curYear] = yearAccrue;
		}

		this.createCanvas();
		this.draw();
	},

	// Create a new canvas to draw on
	createCanvas: function()
	{
		this.width = $('#discovery-graph').width();
		this.height = $('#discovery-graph').height();

		this.paddingSize = this.height * 0.05;
		this.graphWidth = this.width - (this.paddingSize * 2);
		this.graphHeight = this.height - (this.paddingSize * 2);

		this.canvas = $('<canvas />');
		this.canvas.attr('width', this.width);
		this.canvas.attr('height', this.height);
		$('#discovery-graph').append(this.canvas);

		$(this.canvas).click(this.onTouch);
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

	// Draw the background of the graph
	drawBackground: function(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(this.paddingSize, this.graphHeight + this.paddingSize);
		for (var curYear = this.firstYear; curYear <= this.lastYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstYear)  / (this.lastYear - this.firstYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				ctx.lineTo(this.graphWidth * positionX + this.paddingSize, this.graphHeight - (this.graphHeight * positionY) + this.paddingSize);
			}
		}
		ctx.lineTo(this.graphWidth + this.paddingSize, this.graphHeight + this.paddingSize);
		
		ctx.fillStyle = 'rgba(136, 136, 136, 0.2)';
		ctx.fill();
		
		ctx.closePath();
	},

	// Draw the foreground of the graph
	drawForeground: function(ctx)
	{
		// This is the bright active part
		ctx.beginPath();
		ctx.moveTo(this.paddingSize, this.graphHeight + this.paddingSize);
		var pointOnLine = {x: 0, y: 0};
		for (var curYear = this.firstYear; curYear <= Table.currentYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstYear)  / (this.lastYear - this.firstYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				pointOnLine.x = this.graphWidth * positionX + this.paddingSize;
				pointOnLine.y = this.graphHeight - (this.graphHeight * positionY) + this.paddingSize;
				ctx.lineTo(pointOnLine.x, pointOnLine.y);
			}
		}
		ctx.lineTo(pointOnLine.x, this.graphHeight + this.paddingSize);
		ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
		ctx.shadowBlur = 1;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 1;
		ctx.fillStyle = 'rgb(0, 102, 204)';
		ctx.fill();
		ctx.closePath();

		// Draw a line along the top
		ctx.beginPath();
		var pointOnLine = {x: 0, y: 0};
		for (var curYear = this.firstYear; curYear <= Table.currentYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstYear)  / (this.lastYear - this.firstYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				pointOnLine.x = this.graphWidth * positionX + this.paddingSize;
				pointOnLine.y = this.graphHeight - (this.graphHeight * positionY) + this.paddingSize;
				ctx.lineTo(pointOnLine.x, pointOnLine.y + 1);
			}
		}
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

		// Label how many have been discovered
		ctx.font = (this.height * 0.2) + 'px Arial bold';
		ctx.fillStyle = '#c8e2e8';
		if (Table.currentYear >= 1820)
		{ // Show the label on top of the graph
			ctx.textAlign = 'right';
			ctx.fillText(this.numberDiscovered[Table.currentYear], pointOnLine.x - this.arcRadius, this.height - this.arcRadius);
		}
		else
		{ // Show it in the background
			ctx.textAlign = 'left';
			ctx.fillText(this.numberDiscovered[Table.currentYear], (this.width * 0.3) + this.arcRadius, this.height - this.arcRadius);
		}
	},

	// Update the table discovery year (table.js) on touch
	onTouch: function(e)
	{
		var position = e.offsetX / this.width; // Normalized percentage of click position
		var newYear = Math.round(((DiscoveryGraph.lastYear - DiscoveryGraph.firstYear) * position) + DiscoveryGraph.firstYear);
		Table.changeDiscoveryYear(newYear);
	}
};
