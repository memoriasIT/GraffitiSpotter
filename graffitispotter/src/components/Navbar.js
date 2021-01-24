import React from 'react'
import {Link, NavLink} from "react-router-dom";
import Cookies from 'universal-cookie';


// Material UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      color: 'white'
    },
  }));



export default function Navbar() {
    
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    
    const handleAuth = () =>{
        return typeof Bearer !== 'undefined'  || Bearer === null;
        console.log(typeof Bearer !== 'undefined'  || Bearer === null);

    }

    const cookies = new Cookies();
    const Bearer = cookies.get('access-token');
    
    // console.log(typeof Bearer !== 'undefined'  || Bearer === null);
    // const start = () => {
    //     setAuth(typeof Bearer !== 'undefined'  || Bearer === null);
    // }
    // setAuth(typeof Bearer !== 'undefined'  || Bearer === null);
    

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {

        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        
    };

    

    


    return (
        <div className={classes.root}>
        {/* <FormGroup>
            <FormControlLabel
            control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
            label={auth ? 'Logout' : 'Login'}
            />
        </FormGroup> */}
        <AppBar position="static">
            <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" className={classes.title}>
                {/* <Link  to={{pathname: '/'}}></Link> */}
                <NavLink
                className="tags"
                activeStyle={{ color: 'white' }}

                to={{pathname: '/'}}
                >
                GraffitiSpotter
                </NavLink>
            </Typography>

            { !(typeof Bearer !== 'undefined'  || Bearer === null) && (<MenuItem >
                <Typography variant="h6" className={classes.title}><NavLink
                className="tags"
                style={{ color: 'white' }}
                to={{pathname: '/login'}}>
                Login
                </NavLink>
                </Typography></MenuItem>)}
            {(typeof Bearer !== 'undefined'  || Bearer === null) && (
                <div>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}><Link to='/userDetails'>User Details</Link></MenuItem>
                    <MenuItem ><Link  to={{pathname: '/logout'}}>Logout</Link></MenuItem>
                    
                    
                </Menu>
                </div>
            )}
            </Toolbar>
        </AppBar>
        </div>
    );
}
