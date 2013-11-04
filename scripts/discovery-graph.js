/**
	discovery-graph.js
	
	An interactive graph to select the current discovery year.
*/

var DiscoveryGraph = {
	firstYear: 1745,
	lastYear: 2010,
	newlyDiscovered: [],
	numberDiscovered: [],

	// Initialize the graph	
	init: function()
	{
		// Build an array of how many were discovered by that year
		var yearAccrue = 0;
		for (var curElement = 1; curElement <= 118; curElement++)
		{
			var year = periodicElements[curElement].yearDiscovered;
			if (!this.newlyDiscovered[year])
				this.newlyDiscovered[year] = 0;
			this.newlyDiscovered[year] += 1;
			if (year <= this.firstYear)
			{ // Really old discoveries
				yearAccrue += 1;
			}
		}

		// Now put it in a usable format
		for (var curYear = this.firstYear; curYear <= this.lastYear; curYear++)
		{
			if (this.newlyDiscovered[curYear])
				yearAccrue += this.newlyDiscovered[curYear];
			else
				this.newlyDiscovered[curYear] = 0;

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
		$('#discovery-graph').append(this.canvas);

		$('#controls-discovery').bind('mousedown mousemove touchstart touchmove', this.onTouch);
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

	// Draw the background of the graph
	drawBackground: function(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(0, this.height);
		for (var curYear = this.firstYear; curYear <= this.lastYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstYear)  / (this.lastYear - this.firstYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				ctx.lineTo(this.width * positionX, this.height - (this.height * positionY));
			}
		}
		ctx.lineTo(this.width, this.height);
		
		ctx.fillStyle = 'rgba(37, 127, 255, 0.3)';
		ctx.fill();
		
		ctx.closePath();
	},

	// Draw the foreground of the graph
	drawForeground: function(ctx)
	{
		// This is the bright active part
		ctx.beginPath();
		ctx.moveTo(0, this.height);
		var pointOnLine = {x: 0, y: 0};
		for (var curYear = this.firstYear; curYear <= Table.currentYear; curYear++)
		{
			if ((this.numberDiscovered[curYear] != this.numberDiscovered[curYear - 1]) || (curYear == Table.currentYear))
			{ // If we even need to plot a new point
				var positionX = (curYear - this.firstYear)  / (this.lastYear - this.firstYear);
				var positionY = this.numberDiscovered[curYear] / 118;
				pointOnLine.x = this.width * positionX;
				pointOnLine.y = this.height - (this.height * positionY);
				ctx.lineTo(pointOnLine.x, pointOnLine.y);
			}
		}
		ctx.lineTo(pointOnLine.x, this.height);
		ctx.fillStyle = '#257fff';
		ctx.fill();
		ctx.closePath();

		// Draw a line along the right side
		ctx.beginPath();
		ctx.moveTo(pointOnLine.x, pointOnLine.y); // Top right
		ctx.lineTo(pointOnLine.x, this.height);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#d1347f';
		ctx.stroke();
		ctx.closePath();
	},

	// Update the table discovery year (table.js) on touch
	onTouch: function(e)
	{
		if ((e.type == 'mousemove') && (e.which != 1)) // The mouse is moving, but we're not dragging
			return;
		var posX = $('#discovery-graph').offset().left;
		if (typeof(e.pageX) == 'undefined') // We are using a touch device
			e.pageX = e.originalEvent.targetTouches[0].pageX;
		var position = (e.pageX - posX) / DiscoveryGraph.width; // Normalized percentage of click position
		var newYear = Math.round(((DiscoveryGraph.lastYear - DiscoveryGraph.firstYear) * position) + DiscoveryGraph.firstYear);
		
		Table.changeDiscoveryYear(newYear);
	}
};
