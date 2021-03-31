import React, { useContext } from 'react';
import Modal from '../Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { UserContext } from '../../globals/UserContext';
import { AlertContext } from '../../globals/AlertContext';
import { useHistory } from 'react-router-dom';

export default function StripeCancelModal({open, handleClose, email}) {

    const userContext = useContext(UserContext)
    const alertContext = useContext(AlertContext)
    const history = useHistory()

    const stripeCancel = () => {
        let status;
        fetch("/cancel-subscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email: email })
        })
            .then(res => {
                status = res.status
                if (status < 500) 
                    return res.json()
                else 
                    throw Error("Server error")
            })
            .then(res => {
                if (status === 200 && res.success) {
                    alertContext.setAlertStatus({
                        isOpen:true,
                        message:res.response,
                        type:"success"
                      })
                    userContext.setIsSubscribed(false)
                    history.push("/home");
                } 
                else                 
                    throw Error(res.response)               
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                })   
            });
    }

    const content = ()=> {
        return (
            <Grid container>
                <Grid container item justify="space-between">
                    <Grid item xs={12} >
                        <Button fullWidth={true} color="primary" onClick={stripeCancel}>Unsubscribe</Button>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button fullWidth={true} color="primary" onClick={handleClose}>Back</Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <Modal title="Cancel Subscription" text="Are you sure you want to cancel?" content={content()} open={open} handleClose={handleClose}/>
    );
}