import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {ColorPicker} from 'material-ui-color';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormLabel from '@material-ui/core/FormLabel';
import AddIcon from '@material-ui/icons/Add';
import { UserContext } from '../globals/UserContext';
import { AlertContext } from '../globals/AlertContext';


const useStyles = makeStyles((theme) => ({

    btn: {
        textTransform: 'none',
    },

    formControl: {
        marginTop: 20,
        marginBottom: 20
    },

    formControlColor: {
        marginTop: 30,
        marginBottom: 10
    },

    sampleColor: {
        width: '100%',
        height: 8,
        background: theme.palette.primary.main
    }

}));

export default function EventTypeDialog(props) {
        
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [url, setUrl] = useState('');
    const [color, setColor] = useState('#fc6c04');

    const alertContext = useContext(AlertContext)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleDurationChange = (e) => {
        setDuration(e.target.value);
    };

    const handleColorChange = (color) => {
        setColor('#'+color.hex)
    };

    const userContext = useContext(UserContext)
    const userId = userContext.userId
    const userEmail = userContext.userEmail

    const handleConfirm = () => {
        if (title===''||duration===''||url===''||color==='') {
            alertContext.setAlertStatus({
                isOpen:true,
                message:"Missing field(s)",
                type:"error"
              })
         } //might need to change after discuss

        else {
            let status;
            fetch("/event-types/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    user_id: userId,
                    user_email:userEmail,
                    title: title,
                    url: url,
                    duration: duration,
                    color: color
                })
            })
                .then(res => {
                    status = res.status;
                    if (status < 500) return res.json();
                    else throw Error("Server error");
                })
                .then(res => {
                    if (status === 200 && res.success) {
                        alertContext.setAlertStatus({        //might need to change after discuss
                            isOpen:true,
                            message:res.response,
                            type:"success"
                        })
                        setOpen(false);
                        props.setCardInfo(res.cardInfo)
                    }
                    else throw Error(res.response);
                })
                .catch(err => {                             //might need to change after discuss
                    alertContext.setAlertStatus({
                        isOpen:true,
                        message:err.message,
                        type:"error"
                    })
                });   
        }             
    };

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}
                className={classes.btn}>
                <AddIcon fontSize='small' />
                &nbsp;&nbsp;New event type
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                fullWidth maxWidth="sm">
                <div className={classes.sampleColor} style={{background: color}}></div>
                <DialogTitle id="form-dialog-title">Set New Event Type</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the following to compelete your new event type
                    </DialogContentText>
                    <FormControl className={classes.formControlColor}>
                        <FormLabel component="legend" required>Tag Color</FormLabel>
                        <ColorPicker
                            label="Tag Color"
                            name='color'
                            defaultValue='#fc6c04'
                            value={color}
                            onChange={color => handleColorChange(color)}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            type="text"
                            required
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                        <TextField
                            margin="dense"
                            id="url"
                            label="URL"
                            type="text"
                            InputProps={{ startAdornment: <InputAdornment position="start">calendapp.com/{props.userUrl}/</InputAdornment> }}
                            required
                            value={url}
                            onChange={handleUrlChange}
                        />
                    </FormControl>                    
                    <FormControl required className={classes.formControl} fullWidth>
                        <InputLabel id="select-duration-label">Select Duration</InputLabel>
                        <Select
                            labelId="select-duration-label"
                            id="select-duration"
                            value={duration}
                            onChange={handleDurationChange}
                            className={classes.selectEmpty}
                        >
                            <MenuItem value={15}>15mins</MenuItem>
                            <MenuItem value={30}>30mins</MenuItem>
                            <MenuItem value={60}>60mins</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
