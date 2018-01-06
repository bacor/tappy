import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Tappy from './components/Tappy.jsx';
import './styles/reset.scss';
import './styles/style.scss';

// App
const App = () => (
  <MuiThemeProvider>
    <Tappy width={450} height={400} />
  </MuiThemeProvider>
);

// Container
const appWrapper = document.createElement('div');
appWrapper.id = 'app';
document.body.appendChild(appWrapper);
ReactDOM.render(<App />, appWrapper);
