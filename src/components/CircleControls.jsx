import React from 'react';
import paper from 'paper';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Pause from 'material-ui/svg-icons/av/pause';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Delete from 'material-ui/svg-icons/action/delete';
import Alarm from 'material-ui/svg-icons/action/alarm';
import Dialog from 'material-ui/Dialog';

import TextField from 'material-ui/TextField';

class RhythmCircle extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            freq: undefined,
            playing: true,
            times: [],
            radius: undefined,
        };

		// Flag used to skip the first onFrame call
		this.wasPaused = false;
		this.times = [];
		this.outerDots = [];
	}

    componentWillMount() {
        this.setState({ 
            freq: this.props.initialFreq
        });

        this.size = Math.min(this.props.width, this.props.height) - 2*this.props.innerPad;
        this.radius = Math.round(this.size / 2);
    }

    componentDidMount() {
        console.log(this.props)
        this.drawCircle();
        this.start();
    }

    render() {
        return (
            <div className="rhythm-circle-container">
            	<canvas id="rhythm-circle-canvas" 
            		height="{this.props.height}"
            		width="{this.props.width}" 
            		resize="true"></canvas>
                <div className="rhythm-circle-controls">
                	<div className="sliders">
                        <div className="slider">
                            <span>Frequency (Hz)</span>
                            <Slider defaultValue={0.5} className="course-slider"
                                sliderStyle={{ marginTop: 0 }}
                        	 	onChange={this.handleCourseSliderChange.bind(this)}
                        	 	onDragStart={this.handleCourseSliderDragStart.bind(this)}
                        	 	onDragStop={this.handleCourseSliderDragStop.bind(this)} 
                        	 	ref={ (slider) => { this.courseSlider = slider; }}/>
                        </div>
                        <div className="slider">
                            <span>Fine adjustments</span>
                            <Slider defaultValue={0.5} className="fine-slider" 
                                sliderStyle={{ marginTop: 0 }}
                        		onDragStart={this.handleFineSliderDragStart.bind(this)}
                        		onDragStop={this.handleFineSliderDragStop.bind(this)}
                        	 	onChange={this.handleFineSliderChange.bind(this)}
                        	 	ref={ (slider) => { this.fineSlider = slider; }} />
                        </div>
                        <TextField className="slider-value" id="frequency" 
                            style={{ maxWidth: '60px' }}
                            value={ Math.round(this.state.freq*1000)/1000 } />
                    </div>
                    

                	<FlatButton primary={true} 
                	 	icon={ this.state.playing ? <Pause /> : <PlayArrow />} 
                	 	onClick={this.handlePlayPause.bind(this)}/>
                	<FlatButton primary={true} icon={<Delete />} 
                	 	onClick={this.handleDelete.bind(this)}/>
                    <FlatButton primary={true} icon={<Alarm />} 
                        onClick={this.handlePrint.bind(this)} label="Log times" />
                </div>
            </div>
        );
    }


	drawCircle() {
		
		paper.setup('rhythm-circle-canvas');
        var trans = this.size / 2 + this.props.innerPad;
		paper.view.translate(new paper.Point(trans, trans))
		var palette = this.props.muiTheme.palette;

		// The  circle
		this.center = new paper.Point(0,0);
		this.circle = new paper.Path.Circle(this.center, this.radius);
		this.circle.strokeWidth = 2;
		this.circle.strokeColor = palette.primary1Color;
		
		this.outerCircle = new paper.Path.Circle(this.center, this.radius + this.props.innerPad);
		this.outerCircle.strokeWidth = .3;
		this.outerCircle.strokeColor = palette.primary1Color;

		var outerDot = new paper.Path.Circle(new paper.Point(0,0), 2);
		outerDot.fillColor = '#000';
		outerDot.opacity = .4;
		this.outerDotSymbol = new paper.Symbol(outerDot);

		// The moving dot
		this.dot = new paper.Path.Circle(new paper.Point({
			angle: -90, 
			length: this.radius
		}).add(this.center), 7);
		this.dot.fillColor = palette.primary1Color;
		this.dot.strokeWidth = 1;

		// Trajectory
		this.trajectory = new paper.Path();
		this.trajectory.strokeColor = '#000';
		this.trajectory.strokeWidth = .5;
		this.trajectory.add(this.dot.position);
		this.dot.bringToFront();
	}

    setFreq(freq) {
		this.setState({ freq: freq });

		// Update times
		var n = this.trajectory.segments.length;
		for(var i=0; i<n; i++) {
			var s = this.trajectory.segments[i];
			s.point = new paper.Point({
				angle: this.state.freq * 360 * this.times[i], 
				length: this.radius
			}).add(this.center);
			
			if(this.outerDots[i])
				this.outerDots[i].position.angle = s.point.angle;
		}

		// Move dot to last recorded position.
		var last = this.trajectory.segments[n-1].point;
		this.dot.position = this.trajectory.segments[n-1].point;
    }
  
	start() {
		this.setState({ playing: true });
		paper.view.onFrame = this.handleOnFrame.bind(this);
		paper.view.onMouseDown = this.handleOnViewMouseDown.bind(this);
    }

	pause() {
		this.setState({ playing: false });
		paper.view.onFrame = null;
		this.wasPaused = true;
	}

    handleOnFrame(event) {
    	// Skip the first onFrame call after pauses, to avoid jumps in event.delta
    	if(this.wasPaused) {
    		this.wasPaused = false;
    		return;
    	}

		var angle = this.state.freq * 360 * event.delta;
		this.dot.position = this.dot.position.rotate(angle, this.center);
		this.dot.data.time = event.time;
		if(this.trajectory.lastSegment)
			this.trajectory.lastSegment.point = this.dot.position;
    }

    handleOnViewMouseDown() {
    	if(!this.state.playing) return;
    	
    	// Add outer dot
    	var pos = this.dot.position.add(0);
    	pos.length += this.props.innerPad; 
    	var dot = this.outerDotSymbol.place(pos);
    	this.outerDots.push(dot);
    	
    	this.trajectory.add(this.dot.position);
		this.times.push(this.dot.data.time);
    }

    handlePlayPause(event) {
    	if(paper.view.onFrame) {
    		this.pause();
    	} else {
    		this.start();
    	}
    }

    handleDelete(event) {
    	this.trajectory.removeSegments();
    	this.trajectory.add(this.dot.position);
    	this.times = [];
    	for(var i=0; i<this.outerDots.length; i++){
    		this.outerDots[i].remove();
    	}
    }

    handleCourseSliderChange(e, pos) {
		var freq = pos * (this.props.maxFreq - this.props.minFreq) + this.props.minFreq;
		this.setFreq(freq);
    }

    handleCourseSliderDragStart(e, pos) {
    	this.wasPlayingBeforeDrag = this.state.playing;
    	this.pause();
    }

    handleCourseSliderDragStop(e, pos) {
    	if(this.wasPlayingBeforeDrag) this.start();
    }

    handleFineSliderDragStart(e, pos) {
    	this.handleCourseSliderDragStart();
    }

    handleFineSliderChange(e, pos) {
    	if(!this.initialCourseSliderPos)
	    	this.initialCourseSliderPos = this.courseSlider.state.value;
    	var eps = pos - .5
    	var value = this.initialCourseSliderPos + eps / 100
    	this.courseSlider.setState({ value: value})
    	this.handleCourseSliderChange(null, value)
    }

    handleFineSliderDragStop(e, pos) {
    	this.initialCourseSliderPos = null;
    	this.handleCourseSliderDragStop();
    	this.fineSlider.setState({ value: 0.5 });
    }

    handlePrint(e, val) {
         console.log(this.times);
    }

}

RhythmCircle.defaultProps = {
    width: 400,
    height:400,
    innerPad: 20,
    initialFreq: 0.5,
    minFreq: 0.1,
    maxFreq: 2
};

export default muiThemeable()(RhythmCircle);
