import React from 'react';
import paper from 'paper';
import muiThemeable from 'material-ui/styles/muiThemeable';


export class PhasePlot extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
		
	}

    render() {
        return (
            
        );
    }

	getTicks(ts) {
		var min = Math.min.apply(null, ts),
				max = Math.max.apply(null, ts),
				logDiff = Math.log10(max - min),
				order = Math.floor(logDiff),
				unit = Math.pow(10, order),
				minBound = Math.floor(min / unit) * unit,
				maxBound = Math.ceil(max / unit) * unit,
				numTicks = Math.round((maxBound - minBound) / unit);

		if(numTicks <= 3) {
			numTicks = 2 * numTicks;
			unit = unit / 2;
		}

		var ticks = []
		var relTicks = []
		for(var i = 0; i<=numTicks+1; i++) {
			var tick = minBound + i * unit,
					relTick = (tick - minBound) / (maxBound - minBound);
			ticks.push(tick);
			relTicks.push(relTick);
		}

		// Remove superfluous ticks at the end
		while(max <= ticks[ticks.length - 2]) {
			ticks.pop(1)
			relTicks.pop(1);
		}

		return {
			ticks: ticks,
			relTicks: relTicks,
			minTick: Math.min.apply(null, ticks),
			maxTick: Math.max.apply(null, ticks),
		}
	}

    updateTicks(xs, ys) {
		for(var i=0; i < ticks.length; i++) 
			ticks[i].remove();

		for(var i=0; i < gridlines.length; i++)
			gridlines[i].remove();

		var xTicks = getTicks(xs),
				yTicks = getTicks(ys);

		// Draw x ticks & vertical gridlines
		for(var i = 0; i < xTicks.ticks.length; i++) {
			var relx = xTicks.relTicks[i],
					x = relx * (marginRight - marginLeft) + marginLeft;

			var tick = new paper.Path([
				new paper.Point(x, 380),
				new paper.Point(x, 380 + 5)])
			tick.strokeColor = colors.main;
			tick.strokeWidth = 1;
			ticks.push(tick)

			if(i == 0) continue;
			var gridline = new paper.Path([
				new paper.Point(x, 20),
				new paper.Point(x, 380)])
			gridline.strokeWidth = 0.5;
			gridline.dashArray = [.5,3];
			gridline.strokeColor = colors.main;
			gridlines.push(gridline)
		}

		// Draw y ticks & horizontal gridlines
		for(var i = 0; i < yTicks.ticks.length; i++) {
			var rely = yTicks.relTicks[i],
					y = rely * (380 - 20) + 20;

			var tick = new paper.Path([
				new paper.Point(marginLeft-5, y),
				new paper.Point(marginLeft, y)])
			tick.strokeColor = colors.main;
			tick.strokeWidth = 1;
			ticks.push(tick)

			if(i == yTicks.ticks.length-1) continue;
			var gridline = new paper.Path([
				new paper.Point(marginLeft, y),
				new paper.Point(marginRight, y)])
			gridline.strokeWidth = 0.5;
			gridline.dashArray = [.5,3];
			gridline.strokeColor = colors.main;
			gridlines.push(gridline)
		}

		xMinLabel.content = xTicks.minTick;
		xMaxLabel.content = xTicks.maxTick;
		yMinLabel.content = yTicks.maxTick;
		yMaxLabel.content = yTicks.minTick;

		return {xTicks: xTicks, yTicks: yTicks};
	}

}


export default muiThemeable()(RhythmCircle);
// 