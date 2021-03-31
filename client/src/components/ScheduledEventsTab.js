import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import EnhancedTable from './ScheduledEventsTable';


const useStyles = makeStyles((theme) => ({
    tabBackgorund: {
        width: '100%',
        background: theme.palette.light.deepLight,
    },
    tabBody: {
        margin: '0 auto',
        padding: '50px 126px 20px 126px',
        '@media(max-width:768px)': {
            padding: 20
        }
    },
}));

export default function ScheduledEventsTab() {
    const classes = useStyles();

    return (
        <div className={classes.tabBackgorund}>
            <Grid container className={classes.tabBody}>
                <EnhancedTable />
            </Grid>
        </div>

    )
}