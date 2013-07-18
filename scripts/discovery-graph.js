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
		this.firstGraphYear = this.firstYear - 10;

		// Build an array of how many were discovered by that year
		var yearAccrue = 0;
		for (var curElement = 1; curElement <= 118; curElement++)
		{
			var year = periodicElements[curElement].yearDiscovered;
			if (!this.newDiscovered[year])
				this.newDiscovered[year] = 0;
			this.newDiscovered[year] += 1;
			if (year <= this.firstGraphYear)
			{ // Really old discoveries
				yearAccrue += 1;
			}
		}

		// Now put it in a usable format
		for (var curYear = this.firstGraphYear; curYear <= this.lastYear; curYear++)
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

		this.arcRadius = this.height / 10;

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
		ctx.moveTo(this.arcRadius, this.height - 1);
		ctx.arcTo(0, this.height, 0, this.height - 1 - this.arcRadius, this.arcRadius);
		for (var curYear = this.firstGraphYear; curYear <= this.lastYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstGraphYear)  / (this.lastYear - this.firstGraphYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				ctx.lineTo(this.width * positionX, this.height - 1 - (this.height * positionY));
			}
		}
		ctx.lineTo(this.width, this.height - 1 - this.arcRadius);
		ctx.arcTo(this.width, this.height - 1, this.width - this.arcRadius, this.height - 1, this.arcRadius);
		
		ctx.fillStyle = 'rgba(136, 136, 136, 0.2)';
		ctx.fill();
		
		ctx.closePath();
	},

	// Draw the foreground of the graph
	drawForeground: function(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(0, this.height - this.arcRadius);
		
		for (var curYear = this.firstGraphYear; curYear <= Table.currentYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstGraphYear)  / (this.lastYear - this.firstGraphYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				ctx.lineTo(this.width * positionX, this.height - (this.height * positionY));
			}
		}
		var pointOnLine = {
			x: this.width * positionX,
			y: this.height - 1 - (this.height * positionY)
		};

		ctx.arcTo(pointOnLine.x, this.height - 1, 0, this.height - 1, this.arcRadius);
		ctx.arcTo(0, this.height - 1, 0, this.height * (this.numberDiscovered[this.firstGraphYear] / 118), this.arcRadius);
		
		// Background color
		ctx.fillStyle = 'rgb(0, 102, 204)';
		ctx.fill();

		// Background gradient
		var backGradient = ctx.createLinearGradient(0, 0, 0, this.height);
		backGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		backGradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.25)');
		backGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
		ctx.fillStyle = backGradient;
		ctx.fill();
		ctx.closePath();

		// Draw a highlight
		ctx.beginPath();
		for (var curYear = this.firstGraphYear; curYear <= Table.currentYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstGraphYear)  / (this.lastYear - this.firstGraphYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				ctx.lineTo(this.width * positionX, this.height - (this.height * positionY) + 1);
			}
		}
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.stroke();
		ctx.closePath();

		// Draw a shadow
		ctx.beginPath();
		ctx.moveTo(pointOnLine.x, pointOnLine.y);
		ctx.arcTo(pointOnLine.x, this.height - 1, 0, this.height - 1, this.arcRadius);
		ctx.arcTo(0, this.height - 1, 0, this.height * (this.numberDiscovered[this.firstGraphYear] / 118), this.arcRadius);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.stroke();
		ctx.closePath();

		// Label how many have been discovered
		ctx.font = (this.height * 0.2) + 'px Arial bold';
		ctx.fillStyle = '#c8e2e8';
		ctx.shadowOffsetX = -1;
		ctx.shadowOffsetY = -1;
		ctx.shadowBlur = 0;
		ctx.shadowColor = 'rgba(0, 0, 0, 1)';
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
		var newYear = Math.round(((DiscoveryGraph.lastYear - DiscoveryGraph.firstGraphYear) * position) + DiscoveryGraph.firstGraphYear);
		Table.changeDiscoveryYear(newYear);
	}
};
