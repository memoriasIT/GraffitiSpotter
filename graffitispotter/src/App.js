import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// Components
import Navbar from './components/Navbar';
import Container from '@material-ui/core/Container';

// Pages
import home from './pages/home';
import login from './pages/Login';
import signup from './pages/signup';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#819ca9',
      main: '#546e7a',
      dark: '#29434e',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000000',
    },
  },
});

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme = { theme }>
        <Router>
            <Navbar />
            <Container>
              <Switch>
                <Route exact path="/" component={home} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
              </Switch>
            </Container>
          </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
