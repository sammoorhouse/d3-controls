function CircularProgress(element, settings){
	this.element = element;
	this.settings = settings;
	
	this.duration = settings.duration || 500;
					
	this.w = settings.width || 200;
	this.h = settings.height || this.w;
		
	this.outerRadius = settings.outerRadius || this.w/2;
	this.innerRadius = settings.innerRadius || (this.w/2) * (80/100);
	
	this.range = settings.range || {min: 0, max: 100};
	
	this.fill = settings.fill || "#F20100";
	
	this.svg = d3.select("body")
		.append("svg")
			.attr("width", this.w)
			.attr("height", this.h);
	
	CircularProgress.prototype.arc = 
		d3.svg.arc()
			.innerRadius(this.innerRadius)
			.outerRadius(this.outerRadius);
	
	CircularProgress.prototype.paths = function(numerators) {
		var range = this.range;
		return numerators.map(function(numerator){
			var degrees = (numerator/range.max) * 360.0;
			var radians = degrees * (Math.PI / 180);
			var data = {value: numerator, startAngle: 0, endAngle: radians};
			return data;
		});
	}
	
	this.g = this.svg.append('g')
		.attr('transform', 'translate(' + this.w / 2 + ',' + this.h / 2 + ')');
	
	//initialise the control
	this.g.datum([0]).selectAll("path")
		.data(CircularProgress.prototype.paths)
	.enter()
		.append("path")
		.attr("fill", this.fill)
		.attr("d", CircularProgress.prototype.arc)
	.each(function(d){ this._current = d; });
	
	this.svg.datum([0]).selectAll("text")
		.data(CircularProgress.prototype.paths)
	.enter()
		.append("text")
		.attr("transform", "translate(" + this.w/2 + ", " + this.h/1.6 + ")")
		.attr("text-anchor", "middle")
		.text(function(d){return d.value});
	
};

CircularProgress.prototype.update = function(percent) {
	this.g.datum(percent).selectAll("path").data(CircularProgress.prototype.paths).transition().duration(this.duration).attrTween("d", CircularProgress.prototype.arcTween);
	this.svg.datum(percent).selectAll("text").data(CircularProgress.prototype.paths).text(function(d){return d.value;});
};

CircularProgress.prototype.arcTween = function(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return CircularProgress.prototype.arc(i(t));
	};
}