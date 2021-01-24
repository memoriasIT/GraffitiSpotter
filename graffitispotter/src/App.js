import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// Components
import Navbar from './components/Navbar';
import Container from '@material-ui/core/Container';

// Pages
import home from './pages/home';
import LoginPage from './pages/Login';
import SignupPage from './pages/signup';
import UserPage from './pages/user';
import UserDetails from './pages/userDetails';
import deleteUser from './pages/deleteUser';
import updateUser from './pages/updateUser';
import ListOfUsers from './components/listOfUsers/ListOfUsers';
import map from './pages/map';
import graffiti from './pages/graffiti/details';
import createGraffiti from './pages/graffiti/create';
import editGraffiti from './pages/graffiti/edit';
import deleteGraffiti from './pages/graffiti/delete';


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
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignupPage} />
                <Route exact path="/listOfUsers" component={ListOfUsers} />
                <Route exact path="/user" component={UserPage} />
                <Route exact path="/userDetails" component={UserDetails} />
                <Route exact path="/deleteUser" component={deleteUser} />
                <Route exact path="/updateUser" component={updateUser} /> // TODO THIS PAGE
                <Route exact path="/map" component={map} />
                <Route exact path="/graffitis/:id" component={graffiti} />
                <Route exact path="/create" component={createGraffiti} />
                <Route exact path="/graffitis/delete/:id" component={deleteGraffiti} />
                <Route exact path="/graffitis/edit/:id" component={editGraffiti} />
              </Switch>
            </Container>
          </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
