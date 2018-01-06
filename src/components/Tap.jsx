import React from 'react';
import { Howl } from 'howler';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FiberManualRecord from 'material-ui/svg-icons/av/fiber-manual-record';
import Bongo15 from '../samples/Tribal-Bongo-15.wav';
import Bongo53 from '../samples/Tribal-Bongo-53.wav';
import Bongo56 from '../samples/Tribal-Bongo-56.wav';

class Tap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <FloatingActionButton
        ref={(c) => { this.button = c; }}
        label="Tap!"
        onClick={this.handleTap.bind(this)} >
        <FiberManualRecord />
      </FloatingActionButton>
    );
  }

  componentDidMount() {
    this.bongos = {
      bongo15: Bongo15,
      bongo53: Bongo53,
      bongo56: Bongo56,
    };
    this.sound = new Howl({
      src: [this.bongos[this.props.bongo]],
      preload: true,
      volume: .8,
    });
  }

  handleTap() {
    this.sound.play();
    this.props.onTap();
  }
}

Tap.defaultProps = {
  bongo: 'bongo56',
  onTap: () => {},
};

export default Tap;
