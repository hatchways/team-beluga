import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    dialogActions: {
        paddingBottom:0,
    },

    dialogTitle: {
        paddingTop:0,
        paddingBottom:15
    },

    dialogContentText: {
        marginBottom:20
    },

    dialogContent: {
        width:600,
        height:180
    }
}));

function Modal({title,text,content,open,handleClose}) {
    const classes = useStyles()

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogActions className={classes.dialogActions}>
                <CloseIcon color="primary" fontSize="small" onClick={handleClose}/>
            </DialogActions>
            <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>{title}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <DialogContentText className={classes.dialogContentText}>
                    <Typography variant="subtitle1" component="span">{text}</Typography>
                </DialogContentText>
                {content}
            </DialogContent>
        </Dialog>
    )
}

export default Modal