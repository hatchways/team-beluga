import React from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import EventTypesTab from '../components/EventTypesTab'

// TODO: Insert event,appointment components, make responsive

const useStyles = makeStyles((theme) => ({

    dashboard: {
        padding: "70px 150px 0px 150px",
    },

    title: {
        marginBottom: "12px"
    },

    appbar: {
        backgroundColor: theme.bgcolor
    },

    tabIndicator: {
        height: 5,
    },

    tab: {
        marginRight:"25px",
        paddingLeft:"0px",
        color:theme.palette.secondary.main,
    }

}));


function TabPanel(props) {
  const { children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Home(props) {
  const classes = useStyles();
  const {match, history} = props
  const {params} = match
  const {page} = params

  const indexToPage = {
    0:"event",
    1:"appointment"
  }

  const pageToIndex = {
    event:0,
    appointment:1
  }

  const [value, setValue] = React.useState(typeof pageToIndex[page] === "undefined" ? 0:pageToIndex[page]);

  const handleChange = (event, newValue) => {
    history.push(`/home/${indexToPage[newValue]}`)
    setValue(newValue);
  };

  return (
    <div>
        <Grid container className={classes.dashboard}>
            <Grid item xs={12} className={classes.title} >
                <Typography variant="h5">My CalendApp</Typography>
            </Grid>

            <Grid item xs={12}>
            <AppBar position="static" className={classes.appbar} elevation={0}>
                <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary"
                      classes={{ indicator: classes.tabIndicator }} >
                  <Tab className={classes.tab}
                    label={<Typography variant="subtitle1">EVENT TYPES</Typography>} />
                  <Tab className={classes.tab}
                    label={<Typography variant="subtitle1">SCHEDULED EVENTS</Typography>} />
                </Tabs>
            </AppBar>
            </Grid>
        </Grid>

        <TabPanel value={value} index={0}>
            <EventTypesTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
            Appointment page
        </TabPanel>
    </div>
  );
}
export default Home