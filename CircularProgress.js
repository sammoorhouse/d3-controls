function CircularProgress(element, settings){
	this.element = element;
	this.settings = settings;
	
	this.duration = 500;
					
	this.w = 200
	this.h=200;
		
	this.outerRadius = this.w/2;
	this.innerRadius = (this.w/2) * (80/100);
	
	this.svg = d3.select("body")
		.append("svg")
			.attr("width", this.w)
			.attr("height", this.h);
	
	CircularProgress.prototype.arc = 
		d3.svg.arc()
			.innerRadius(this.innerRadius)
			.outerRadius(this.outerRadius);
				
	this.g = this.svg.append('g')
		.attr('transform', 'translate(' + this.w / 2 + ',' + this.h / 2 + ')');
	
	//initialise the control
	this.g.datum([0]).selectAll("path")
		.data(paths)
	.enter()
		.append("path")
		.attr("fill", "#F20100")
		.attr("d", CircularProgress.prototype.arc)
	.each(function(d){ this._current = d; });
	
	this.svg.datum([0]).selectAll("text")
		.data(paths)
	.enter()
		.append("text")
		.attr("transform", "translate(" + this.w/2 + ", " + this.h/1.6 + ")")
		.attr("text-anchor", "middle")
		.text(function(d){return d.value});
	
};

CircularProgress.prototype.update = function(percent) {
	this.g.datum(percent).selectAll("path").data(paths).transition().duration(this.duration).attrTween("d", CircularProgress.prototype.arcTween);
	this.svg.datum(percent).selectAll("text").data(paths).text(function(d){return d.value;});
};

function paths(percentages){
	return percentages.map(function(percent){
		var degrees = (percent/100) * 360.0;
		var radians = degrees * (Math.PI / 180);
		var data = {value: percent, startAngle: 0, endAngle: radians};
		return data;
	});
}

CircularProgress.prototype.arcTween = function(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return CircularProgress.prototype.arc(i(t));
	};
}