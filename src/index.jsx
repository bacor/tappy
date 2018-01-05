import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RhythmCircle from './components/RhythmCircle.jsx';
import './styles/reset.scss';
import './styles/style.scss';

// App
const App = () => (
  <div>
    <MuiThemeProvider>
      <div className="rhythm-circle-container">
        <RhythmCircle width={450} height={400} innerPad={10} />
      </div>
    </MuiThemeProvider>

    <div className="phaseplot-container"></div>
  </div>
);

// Container
const appWrapper = document.createElement('div');
appWrapper.id = 'app';
document.body.appendChild(appWrapper);
ReactDOM.render(<App />, appWrapper);
