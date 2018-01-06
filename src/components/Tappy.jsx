import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Circle from './Circle.jsx';
import PhasePlot from './PhasePlot.jsx';
import Controls from './Controls.jsx';
import { Metronome, bpmToHerz } from './Metronome.jsx';

class Tappy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpm: undefined,
      times: undefined,
    };
  }

  componentWillMount() {
    this.setState({
      bpm: this.props.initBpm,
      times: this.props.times,
    });

    this.radius = Math.floor(Math.min(this.props.width, this.props.height) / 2);
  }

  render() {
    return (
      <div className="tappy-container">
        <div className="visuals">
          <Circle ref={ (c) => { this.circle = c; }}
            radius={this.radius}
            color={this.props.muiTheme.palette.primary1Color}
            data={this.state.times}
            frequency={bpmToHerz(this.state.bpm)}
            play={true} />

          <PhasePlot ref={ (c) => { this.phasePlot = c; }}
            width={400}
            height={400}
            data={this.state.times} />
        </div>

        <div className="controls">
          <Paper style={{ marginRight: 20 }}>
            <Metronome
              minBpm={this.props.minBpm}
              maxBpm={this.props.maxBpm}
              initBpm={this.props.initBpm}
              onChange={this.handleTempoChange.bind(this)} />
          </Paper>

          <Paper>
            <Controls
              onTap={ this.handleTap.bind(this) }
              onDelete={ this.handleDelete.bind(this) } />
          </Paper>
        </div>
      </div>
    );
  }

  handleTap() {
    if (!this.t0) {
      this.t0 = Date.now();
    }
    const time = Date.now() - this.t0;
    const newTimes = _.clone(this.state.times);
    newTimes.push(time);
    this.setState({ times: newTimes });
  }

  handleDelete() {
    this.setState({ times: [] });
  }

  handleTempoChange(bpm) {
    this.setState({ bpm });
  }
}

Tappy.defaultProps = {
  width: 400,
  height: 400,
  initBpm: 30,
  minBpm: 1,
  maxBpm: 100,
  times: [], // [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15], // [0.5, 0.8, 1.3, 1.6],
};

export default muiThemeable()(Tappy);
