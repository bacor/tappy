import React from 'react';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import VolumeUp from 'material-ui/svg-icons/av/volume-up';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import _ from 'lodash';
import { Howl } from 'howler';
import Bongo53 from '../samples/Tribal-Bongo-53.wav';


function bpmToHerz(bpm) {
  return bpm / 60;
}

function herzToBpm(hz) {
  return hz * 60;
}

function round(x, precision) {
  const base = 10 ** (precision || 0);
  return Math.round(x * base) / base;
}

class Metronome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpm: undefined,
      error: undefined,
      textFieldValue: '',
      play: undefined,
    };

    this.interval = 0;
  }

  componentWillMount() {
    this.setState({
      bpm: this.props.initBpm,
      play: this.props.autoplay,
    });
    this.tick = new Howl({
      src: [Bongo53],
      preload: true,
    });
  }

  componentDidMount() {
    this.updateTick();
  }

  render() {
    return (
      <div>
        <TextField
          name="bpm"
          ref={(el) => { this.textField = el; }}
          className="slider-value"
          floatingLabelText={`BPM: ${round(this.state.bpm, this.props.displayPrecision)}`}
          hintText="Type & press enter"
          value={this.state.textFieldValue}
          errorText={this.state.error}
          onChange={this.handleTextFieldChange.bind(this)}
          onKeyDown={this.handleTextFieldKeyDown.bind(this)}
          onBlur={this.handleTextFieldBlur.bind(this)} />

        <Slider
          ref={(el) => { this.courseSlider = el; }}
          sliderStyle={{ marginTop: 8, marginBottom: 10 }}
          step={1}
          min={this.props.minBpm}
          max={this.props.maxBpm}
          value={this.state.bpm}
          onChange={this.handleCourseSliderChange.bind(this)} />

        <Slider
          ref={(el) => { this.fineSlider = el; }}
          sliderStyle={{ marginTop: 0, marginBottom: 10 }}
          step={0.001}
          min={-1 * this.props.refinement}
          max={this.props.refinement}
          defaultValue={0}
          onDragStop={this.handleFineSliderDragStop.bind(this)}
          onChange={this.handleFineSliderChange.bind(this)} />

        <FlatButton
          ref={ (el) => { this.toggleTick = el; }}
          primary={true}
          icon={this.state.play ? <VolumeOff /> : <VolumeUp />}
          onClick={ this.handleToggleTick.bind(this) } />
      </div>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.bpm !== this.state.bpm || this.state.play != nextState.play) {
      this.props.onChange(nextState.bpm);
      this.updateTick(nextState);
    }
  }

  updateTick(nextState) {
    const state = nextState || this.state;
    if (state.play) {
      clearInterval(this.interval);
      const period = (1 / bpmToHerz(this.state.bpm)) * 1000;
      this.interval = setInterval(() => {
        this.tick.play();
      }, period);
    } else {
      clearInterval(this.interval);
    }
  }

  isWithinRange(bpm) {
    return (bpm >= this.props.minBpm) && (bpm <= this.props.maxBpm);
  }

  handleTextFieldChange(e, value) {
    const newBpm = parseFloat(value);
    let error;
    if (!_.isNumber(newBpm) || !this.isWithinRange(newBpm)) {
      error = `Insert a number between ${this.props.minBpm} and ${this.props.maxBpm}`;
    }
    this.setState({
      error,
      textFieldValue: value,
    });
  }

  handleTextFieldKeyDown(event) {
    if (event.key !== 'Enter') return;

    const newBpm = parseFloat(event.target.value);
    if (_.isNumber(newBpm) && this.isWithinRange(newBpm)) {
      this.setState({
        bpm: newBpm,
        textFieldValue: '',
        error: undefined,
      });
      this.textField.blur();
    } else {
      const error = `Insert a number between ${this.props.minBpm} and ${this.props.maxBpm}`;
      this.setState({ error });
    }
  }

  handleTextFieldBlur(event) {
    this.setState({ error: undefined });
  }

  handleCourseSliderChange(e, bpm) {
    this.setState({ bpm });
  }

  handleFineSliderChange(e, refinement) {
    if (!this.bpmBeforeRefinment) {
      this.bpmBeforeRefinment = this.state.bpm + 0;
    }

    let bpm = this.bpmBeforeRefinment + refinement;
    bpm = Math.min(bpm, this.props.maxBpm);
    bpm = Math.max(bpm, this.props.minBpm);
    this.setState({ bpm });
  }

  handleFineSliderDragStop(e, pos) {
    this.bpmBeforeRefinment = undefined;
    this.fineSlider.setState({ value: 0 });
  }

  handleToggleTick() {
    this.setState({ play: !this.state.play });
  }
}

Metronome.defaultProps = {
  initBpm: 100,
  minBpm: 1,
  maxBpm: 100,
  displayPrecision: 3,
  refinement: 2,
  autoplay: true,
};

export {
  Metronome,
  herzToBpm,
  bpmToHerz,
};
