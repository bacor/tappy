import React from 'react';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import _ from 'lodash';

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
    };
  }

  componentWillMount() {
    this.setState({ bpm: this.props.initBpm });
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
      </div>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.bpm !== this.state.bpm) {
      this.props.onChange(nextState.bpm);
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
}

Metronome.defaultProps = {
  initBpm: 100,
  minBpm: 1,
  maxBpm: 100,
  displayPrecision: 3,
  refinement: 2,
};

export {
  Metronome,
  herzToBpm,
  bpmToHerz,
};
