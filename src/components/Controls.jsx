import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Pause from 'material-ui/svg-icons/av/pause';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Delete from 'material-ui/svg-icons/action/delete';
import Tap from './Tap.jsx';

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: undefined,
    };
  }

  componentWillMount() {
    this.setState({ playing: this.props.playing });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <FlatButton
          ref={ (el) => { this.playPause = el; }}
          primary={ true }
          icon={ this.state.playing ? <Pause /> : <PlayArrow /> }
          onClick={ this.props.onToggle }
          style={{ top: -20 }} />
        <Tap
          ref={ (el) => { this.tap = el; }}
          onTap={ this.props.onTap } />
        <FlatButton
          ref={ (el) => { this.delete = el; }}
          primary={true}
          icon={<Delete />}
          onClick={ this.props.onDelete }
          style={{ top: -20 }} />
      </div>
    );
  }
}

Controls.defaultProps = {
  playing: true,
  onTap: () => {},
  onDelete: () => {},
  onToggle: () => {},
};

export default Controls;
