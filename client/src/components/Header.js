import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '../images/7f21cd746f9cd939e52f7d98d746700660f6d580.png';
import logo from "../images/logo.png"
import {AlertContext} from '../globals/AlertContext'; 
import { UserContext } from '../globals/UserContext';


// TODO: Add correct links, load profile pic/username, fix popup menu, make responsive

const useStyles = makeStyles((theme) => ({

    appbar: {
        //padding: "20px 5px 20px 50px",
        backgroundColor: theme.bgcolor,
        height: 86,
        justifyContent: 'center'
    },

    links: {
        padding: "0px 20px",
    },

    avatar: {
      height: 48,
      width: 48,
      objectFit: 'cover',
      borderRadius: 30,
      marginRight: 20
    },

    name: {
      margin: 'auto 0'
    },
    drawer: {
      '& li': {
        minWidth: 250,
        padding: '15px 20px'
      }
    },
    drawerSide: {
      marginTop: 'auto'
    },
}))

const navLinks = [
  { id:1, title: 'Home', path: '/' },
  { id:2, title: 'Integration', path: '#' },
  { id:3, title: 'Upgrade account', path: '/Upgrade' },
]

function Header(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [navAnchorEl, setNavAnchorEL] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const [displayItem, setDisplayItem] = useState(false);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const alertContext = useContext(AlertContext);
  const userContext = useContext(UserContext);
  const userId = userContext.userId;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 960
        ? setMobileView(true)
        : setMobileView(false);
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteAccount = () => {
    let status
    fetch(`/user/${userId}/delete`, {
      method: "DELETE",
      credentials: "include"
    })
    .then(res => {
        status = res.status

        if (status < 500) return res.json();
        else throw Error("Server error");
    })
    .then(res=> {
        if (status === 200) {
          alertContext.setAlertStatus({
            isOpen:true,
            message:res.response,
            type:"success"
            })   
          setAnchorEl(null)
          history.push("/login")
        }
        else if (status === 400) {
            alertContext.setAlertStatus({
            isOpen:true,
            message:res.response,
            type:"error"
            })  
          setAnchorEl(null)
        }
        else 
          throw Error("Server error");
      })
    .catch(err => {
      setAnchorEl(null);
      alertContext.setAlertStatus({
        isOpen:true,
        message:err.message,
        type:"error"
        })  
    })
  }

  const logout = () => {
    let status
    fetch("/logout", {
      method: "POST",
      credentials: "include"
    })
    .then(res => {
        status = res.status

        if (status < 500) return res.json();
        else throw Error("Server error");
    })
    .then(res=> {
        if (status === 200) {
          alertContext.setAlertStatus({
            isOpen:true,
            message:res.response,
            type:"success"
            })   
          setAnchorEl(null)
          history.push("/login")
        }
        else if (status === 400) {
            alertContext.setAlertStatus({
            isOpen:true,
            message:res.response,
            type:"error"
            })  
          setAnchorEl(null)
        }
        else 
          throw Error("Server error");
      })
    .catch(err => {
      setAnchorEl(null)
      alertContext.setAlertStatus({
        isOpen:true,
        message:err.message,
        type:"error"
        })  
    })
  }

  const handleNavItemShow = (e) => {
    setNavAnchorEL(e.currentTarget);
    setDisplayItem(true)
  }

  const handleNavItemClose = () => {
    setDisplayItem(false)
  }

  const displayDesktop = () => {
    return(
      <Grid container>
        <AppBar position="static" className={classes.appbar}>
          <Toolbar>
            <Grid item sm={4}>
              <img src={logo} />
            </Grid>
            <Grid item container justify="flex-end" spacing={2} className={classes.links}>
              {navLinks.map(({id, title, path }) => (
                  <Grid item key={id}>
                      <Link to={path} style= {{textDecoration: 'none'}}>
                          <Typography variant="h6" color={title==="Upgrade account"? "primary":"secondary"}>
                              {title}
                          </Typography>
                      </Link>
                  </Grid>
              ))}
            </Grid>
            <Grid item container direction="row" justify='flex-end' lg={3} md={4} spacing={0}> 
              <Button onClick={handleMenu}>
                <Grid item>
                    <img src={Avatar} className={classes.avatar} />            
                </Grid>
                <Grid item className={classes.name}>
                  <Typography variant="h6">{props.name}</Typography>                  
                </Grid>
              </Button> 
            </Grid>
            <Menu
              id="menu-appbar"
              anchorel={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>                
              <MenuItem onClick={deleteAccount}>Delete Account</MenuItem>  
            </Menu>
          </Toolbar>
        </AppBar>
      </Grid>
    )
  } 

  const displayMobile = () => {
    return(
      <Grid container>
        <AppBar position="static" className={classes.appbar}>
          <Toolbar>
            <Grid item xs={4}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleNavItemShow}
                aria-controls='menu-navitem'
                aria-haspopup="true"
              >
                <MenuIcon />
              </IconButton>
            </Grid>          
            <Grid item xs={8}>
              <img src={logo} />
            </Grid>
            <Drawer
                id="menu-navitem"
                anchorel={navAnchorEl}
                getcontentanchorel={null}
                open={displayItem}
                onClose={handleNavItemClose}
                className={classes.drawer}
              >
                <MenuItem>
                  <img src={Avatar} onClick={handleMenu} className={classes.avatar} />
                  <Typography variant="h6">{props.name}</Typography>
                </MenuItem>
                <Divider />
                {navLinks.map(({id, title, path }) => (
                  <MenuItem key={id}>
                      <Link to={path} style= {{textDecoration: 'none'}}>
                          <Typography variant="h6" color={title==="Upgrade account"? "primary":"secondary"}>
                              {title}
                          </Typography>
                      </Link>
                  </MenuItem>
                ))}
                <MenuItem onClick={logout} className={classes.drawerSide}>
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>                
                <MenuItem onClick={deleteAccount}>
                  <Typography variant="body1">Delete Account</Typography>
                </MenuItem>
              </Drawer>
          </Toolbar>
        </AppBar>
      </Grid>
    )
  }

  return (
    <>
      {mobileView? displayMobile(): displayDesktop()}
    </>
    );
  }

export default Header