import React from 'react';
import paper from 'paper';
import _ from 'lodash';

class Circle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    // Flag used to skip the first onFrame call
    this.wasPaused = false;
    this.outerDots = [];
    this.initAngle = 0;
  }

  componentWillMount() {
    this.outerRadius = Math.floor(this.props.radius - this.props.outerStrokeWidth);
    this.innerRadius = this.outerRadius - this.props.padding - this.props.strokeWidth;
  }

  componentDidMount() {
    this.drawCircle();
  }

  render() {
    return (
      <div>
        <canvas ref={(c) => { this.canvas = c; }}
          height={2 * this.props.radius}
          width={2 * this.props.radius}
          resize="true"></canvas>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const omitKeys = ['data', 'play', 'frequency'];
    const prevStyles = _.omit(prevProps, omitKeys);
    const styles = _.omit(this.props, omitKeys);

    // Check if any of the styles are updated: that requires redrawing
    if (!_.isEqual(prevStyles, styles)) {
      this.drawCircle();

    // Otherwise update the existing drawing
    } else {
      this.updatePlay();
      this.updateData(prevProps.data);
    }
  }

  drawCircle() {
    paper.setup(this.canvas);
    paper.view.translate(new paper.Point(this.props.radius, this.props.radius));

    // Inner and outer circle
    const center = new paper.Point(0, 0);

    this.innerCircle = new paper.Path.Circle(center, this.innerRadius);
    this.innerCircle.strokeWidth = this.props.strokeWidth;
    this.innerCircle.strokeColor = this.props.color;

    // this.outerCircle = new paper.Path.Circle(center, this.outerRadius);
    // this.outerCircle.strokeWidth = this.outerStrokeWidth;
    // this.outerCircle.strokeColor = this.props.color;

    // Position marker on inner circle
    const initPosMarkerPos = new paper.Point({
      angle: this.props.initPosMarkerAngle,
      length: this.innerRadius,
    });
    this.posMarker = new paper.Path.Circle(initPosMarkerPos, this.props.posMarkerRadius);
    this.posMarker.fillColor = this.props.color;

    // Tap markers on outer circle
    const tapMarker = new paper.Path.Circle(center, this.props.tapMarkerRadius);
    tapMarker.fillColor = this.props.tapMarkerColor;
    tapMarker.opacity = this.props.tapMarkerOpacity;
    this.tapMarkerSymbol = new paper.Symbol(tapMarker);
    this.tapMarkers = new paper.Group({ position: center });

    // Trajectory
    this.trajectory = new paper.Path();
    this.trajectory.strokeColor = this.props.trajectoryColor;
    this.trajectory.strokeWidth = this.props.trajectoryWidth;
    this.trajectory.add(this.posMarker.position);
    this.posMarker.bringToFront();

    // All non-style related stuff
    this.updatePlay();
    this.updateData();
  }

  updatePlay() {
    if (this.props.play) {
      paper.view.onFrame = this.handleOnFrame.bind(this);
    } else {
      paper.view.onFrame = undefined;
    }
  }

  updateData(prevData) {
    // Redraw or add only a single point?
    const addPoint = _.isEqual(prevData, _.dropRight(this.props.data));

    if (addPoint) {
      this.addDataPoint(_.last(this.props.data));
    } else {
      this.trajectory.removeSegments();
      this.tapMarkers.removeChildren();

      for (let i = 0; i < this.props.data.length; i += 1) {
        this.addDataPoint(this.props.data[i]);
      }
    }
  }

  addDataPoint(time) {
    const pos = new paper.Point({
      angle: this.timeToAngle(time),
      length: this.innerRadius,
    });

    // Add trajectory segment
    this.trajectory.add(pos);
    this.posMarker.position = pos;

    // Add tapmarker
    pos.length = this.outerRadius;
    const tapMarker = this.tapMarkerSymbol.place(pos);
    this.tapMarkers.addChild(tapMarker);
  }

  handleOnFrame(event) {
    // Skip the first onFrame call after pauses, to avoid jumps in event.delta
    if (this.wasPaused) {
      this.wasPaused = false;
      return;
    }

    const angle = this.props.frequency * 360 * event.delta;
    this.posMarker.position = this.posMarker.position.rotate(angle, this.center);
    this.posMarker.data.time = event.time;
  }

  timeToAngle(t) {
    return ((t / 1000) * this.props.frequency * 360) % 360;
  }
}

Circle.defaultProps = {
  data: [],
  radius: 200,
  padding: 10,
  frequency: 0.5,
  play: true,
  color: '#ff0000',
  strokeWidth: 2,
  outerStrokeWidth: 0.5,
  tapMarkerColor: '#000',
  tapMarkerOpacity: 0.3,
  tapMarkerRadius: 2,
  posMarkerRadius: 7,
  trajectoryColor: '#000',
  trajectoryWidth: 0.5,
};

export default Circle;
