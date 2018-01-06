import React from 'react';
import Plottable from 'plottable';
import _ from 'lodash';
import '../../node_modules/plottable/plottable.css';

class PhasePlot extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div ref={ (c) => { this.canvas = c; }}
          style={{ width: this.props.width, height: this.props.height }}>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.processData();
    this.createPlot();
  }

  componentDidUpdate(prevProps, prevState) {
    const prevStyles = _.omit(prevProps, 'data');
    const styles = _.omit(this.props, 'data');
    const onlyDataUpdated = _.isEqual(prevStyles, styles);

    // Process the data
    this.plot.removeDataset(this.dataset);
    this.processData();
    if (onlyDataUpdated) {
      this.plot.addDataset(this.dataset);
    } else {
      this.createPlot();
    }
  }

  processData() {
    // Extract intervals and build up (x,y) dataset
    this.intervals = [];
    this.data = [];
    let interval;
    const n = this.props.data.length;
    for (let i = 1; i < n; i += 1) {
      interval = this.props.data[i] - this.props.data[i - 1];
      this.addInterval(interval);
    }

    this.dataset = new Plottable.Dataset(this.data);
  }

  addInterval(interval) {
    // Store interval
    this.intervals.push(interval);

    // Add to (x, y) dataset
    const n = this.intervals.length;
    if (n >= 2) {
      this.data.push({
        x: this.intervals[n - 2],
        y: this.intervals[n - 1],
      });
    }
  }

  createPlot() {
    const xScale = new Plottable.Scales.Linear();
    const yScale = new Plottable.Scales.Linear();
    const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
    const yAxis = new Plottable.Axes.Numeric(yScale, 'left');

    this.plot = new Plottable.Plots.Line();
    this.plot.x(d => d.x, xScale);
    this.plot.y(d => d.y, yScale);
    this.plot.attr('stroke-width', this.props.strokeWidth);
    this.plot.attr('stroke', this.props.strokeColor);
    this.plot.addDataset(this.dataset);

    this.chart = new Plottable.Components.Table([
      [yAxis, this.plot],
      [null, xAxis],
    ]);
    this.chart.renderTo(this.canvas);
  }
}

PhasePlot.defaultProps = {
  height: 400,
  width: 400,
  data: [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16],
  strokeColor: '#000000',
  strokeWidth: 0.3,
};

export default PhasePlot;
