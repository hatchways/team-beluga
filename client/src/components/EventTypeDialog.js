import React from 'react';
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


const useStyles = makeStyles((theme) => ({

    btn: {
        textTransform: 'none',
    },

    dialog: {
        padding: 35
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

export default function EventTypeDialog() {
        
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [values, setValues] = React.useState({
        title: '',
        duration: '',
        url: '',
        color: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const handleColorChange = (color) => {
        setValues({ ...values, 'color': '#'+color.hex})
    }

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}
                className={classes.btn}>
                +&nbsp;&nbsp;New event type
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                className={classes.dialog}>
                <div className={classes.sampleColor} style={{background: values.color}}></div>
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
                            value={values.color}
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
                            value={values.title}
                            onChange={handleInputChange('title')}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                        <TextField
                            margin="dense"
                            id="url"
                            label="URL"
                            type="text"
                            InputProps={{ startAdornment: <InputAdornment position="start">calendapp.com/</InputAdornment> }}
                            required
                            value={values.url}
                            onChange={handleInputChange('url')}
                        />
                    </FormControl>                    
                    <FormControl required className={classes.formControl} fullWidth>
                        <InputLabel id="select-duration-label">Select Duration</InputLabel>
                        <Select
                            labelId="select-duration-label"
                            id="select-duration"
                            value={values.duration}
                            onChange={handleInputChange('duration')}
                            className={classes.selectEmpty}
                        >
                            <MenuItem value={5}>5mins</MenuItem>
                            <MenuItem value={10}>10mins</MenuItem>
                            <MenuItem value={20}>20mins</MenuItem>
                            <MenuItem value={30}>30mins</MenuItem>
                            <MenuItem value={45}>45mins</MenuItem>
                            <MenuItem value={60}>60mins</MenuItem>
                            <MenuItem value={80}>80mins</MenuItem>
                            <MenuItem value={100}>100mins</MenuItem>
                            <MenuItem value={120}>120mins</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
