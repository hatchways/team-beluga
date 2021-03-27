import React,{useContext} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { AlertContext } from '../globals/AlertContext';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function FlashAlert() {
  const classes = useStyles();
  const alertContext = useContext(AlertContext);
  const alertStatus = alertContext.alertStatus

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    alertContext.setAlertStatus(
      prevAlertStatus => {
        const newAlertStatus = {...prevAlertStatus}
        newAlertStatus.isOpen = false
        return newAlertStatus
      }
    )
  };

  return (
    <div className={classes.root}>
      <Snackbar open={alertStatus.isOpen} autoHideDuration={2500} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertStatus.type}>
          {alertStatus.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default FlashAlert;