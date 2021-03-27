import logo from "../images/logo.png"
import React from "react";
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import Avatar from '../images/7f21cd746f9cd939e52f7d98d746700660f6d580.png';


// TODO: Add correct links, load profile pic/username, fix popup menu, make responsive

const useStyles = makeStyles((theme) => ({

    appbar: {
        padding: "20px 5px 20px 50px",
        backgroundColor: theme.bgcolor
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
    }
}))

const navLinks = [
  { title: 'Home', path: '' },
  { title: 'Integration', path: '' },
  { title: 'Upgrade account', path: '' },
]

function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          alert(res.response)
          setAnchorEl(null)
          history.push("/login")
        }
        else if (status === 400) {
          alert(res.response)
          setAnchorEl(null)
        }
        else 
          throw Error("Server error");
      })
    .catch(err => {
      setAnchorEl(null)
      alert(err.message);
    })


  }


return (
    <Grid container>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Grid item sm={8}>
            <img src={logo} />
          </Grid>

          <Grid item container lg={5} justify="space-evenly" className={classes.links}>
            {navLinks.map(({ title, path }) => (
                <Grid item>
                    <Link to={path} style= {{textDecoration: 'none'}}>
                        <Typography variant="h6" color={title==="Upgrade account"? "primary":"secondary"}>
                            {title}
                        </Typography>
                    </Link>
                </Grid>
            ))}
          </Grid>

          <Grid item container direction="row" lg={2} spacing={0}>
            <Grid item>
             <img src={Avatar} onClick={handleMenu} className={classes.avatar} />
            </Grid>

            <Grid item className={classes.name}>
              <Typography variant="h6">John Doe</Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>                
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Grid>
  );
}

export default Header