import React, {useState} from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import EventTypesTab from '../components/EventTypesTab'
import Header from "../components/Header";
import ScheduledEventTab from "../components/ScheduledEventsTab";

// TODO: Insert event,appointment components, make responsive

const useStyles = makeStyles((theme) => ({

    dashboard: {
        padding: "70px 0 0 126px",
        '@media(max-width:768px)': {
          padding: '70px 20px 0 20px'
      }
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
        <Box p={0}>
          {children}
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

  const [value, setValue] = useState(typeof pageToIndex[page] === "undefined" ? 0:pageToIndex[page]);
  const [userUrl, setUserUrl] = useState('');
  const [name, setName] = useState('');

  const handleChange = (event, newValue) => {
    history.push(`/home/${indexToPage[newValue]}`)
    setValue(newValue);
  };

  return (
    <div>
        <Header name={name} />
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
            <EventTypesTab name={name} setName={setName} userUrl={userUrl} setUserUrl={setUserUrl} />
        </TabPanel>
        <TabPanel value={value} index={1}>
            <ScheduledEventTab />
        </TabPanel>
    </div>
  );
}
export default Home