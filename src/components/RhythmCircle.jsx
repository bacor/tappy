import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import _ from 'lodash';
import Circle from './Circle.jsx';


class RhythmCircle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: undefined,
      times: undefined,
    };

    // Flag used to skip the first onFrame call
    this.wasPaused = false;
  }

  componentWillMount() {
    this.setState({
      frequency: this.props.initialFreq,
      times: this.props.times,
    });

    this.radius = Math.floor(Math.min(this.props.width, this.props.height) / 2);
  }

  componentDidMount() {
    function test() {
      const data = _.clone(this.state.times);
      data.push(3.6);
      this.setState({ times: data, frequency: 2.1 });
    }
    window.test = test.bind(this);
  }

  render() {
    return (
      <div>
        <Circle ref={ (c) => { this.circle = c; }}
          radius={this.radius}
          color={this.props.muiTheme.palette.primary1Color}
          data={this.state.times}
          frequency={this.state.frequency}
          play={true} />
      </div>
    );
  }
}

RhythmCircle.defaultProps = {
  width: 400,
  height: 400,
  initialFreq: 0.351,
  minFreq: 0.1,
  maxFreq: 2,
  times: [0.5, 0.8, 1.3, 1.6],
};

export default muiThemeable()(RhythmCircle);
