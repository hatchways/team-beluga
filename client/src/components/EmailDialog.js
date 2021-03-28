import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    confirmBtn: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5,
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        alignItems: 'center',
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main
        },
        width: '48.5%',
        display: 'inline-block!important'
    },
}));

export default function EmailDialog(props) {
    
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = () => {
        let status;
        const dateString = new Date(props.selectedDay).toISOString().substring(0, 10);
        const dateTimeString = new Date(dateString + ' ' + props.selectedTime).toISOString();
        const timezone = new Date().getTimezoneOffset(); 
        // offset for now, can change to "America/vancouver" format depends on needs
        
        fetch('/appointment', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                dateTime: dateTimeString,
                timezone: timezone,
                email: email
            })
        })
            .then(res => {
                status = res.status;
                if (status < 500) return res.json();
                else throw Error("Server error");
            })
            .then(res => {
                if (status === 200 && res.success == true) {
                    alert('success')
                }
                else throw Error("Failed to get calendar");
            })            
            .catch(err => {
                alert(err.message);
            });
        setOpen(false);
    }

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}
            className={classes.confirmBtn}>
                Confirm
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Book Appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To book an appointment, please enter your email address here to 
                        receive email confirmation.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={handleEmailChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
