import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EventTypeDialog from './EventTypeDialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import Avatar from '../images/7f21cd746f9cd939e52f7d98d746700660f6d580.png';

const useStyles = makeStyles((theme) => ({
    //card
    cardBody: {
        margin: '30px 60px 30px 0',
        '@media(max-width:960px)': {
            margin: '30px 0px 30px 0'
        },
        boxShadow: theme.palette.shadow.card,
    },
    colorTag: {
        width: '100%',
        height: 8,
        background: theme.palette.primary.main
    },
    copyLinkBtn: {
        marginLeft: 'auto!important',
        padding: '5px 20px',
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        '& span': {
            textTransform: 'none'
        }
    },
    settingIcon: {
        color: theme.palette.muted.main,
        fontWeight: 300
    },
    icon: {
        verticalAlign: 'top'
    },
    cardText: {
        padding: '0 16px 40px 32px'
    },
    cardFooter: {
        padding: '20px 20px'
    },
    //tab
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
    avatar: {
        height: 48,
        width: 48,
        objectFit: 'cover',
        borderRadius: 30,
        marginRight: 20
    },
    newEventBtnContainer: {
        paddingRight: 60,
        '@media(max-width:960px)': {
            paddingRight: 0
        }
    },
    footer: {
        padding: '40px 0'
    },
    startGuideBtn: {
        color: '#fff',
        background: theme.palette.primary.main,
        borderRadius: 30,
        textTransform: 'none',
        padding: '10px 35px',
        boxShadow: 'none',
        marginLeft: 'auto'
    }
}));

function EventTypeCard(props) {
    const classes = useStyles();
    const { color, duration, title, url } = props;
    const [link, setLink] = useState(url);
    const handleCopyLink = () => {
        navigator.clipboard.writeText('calendapp.com/userurl/'+link)//need to change 'userurl' as fetched later
        .then(() => {
            alert('Copied: '+link)
        }, () => {
            alert('Fail to copy, Please copy manually')
        });        
    };
    return (
        <Grid item xs={12} sm={12} md={6} lg={4}>
            <Card className={classes.cardBody}>
                <div className={classes.colorTag} style={{background: color}}></div>
                <CardHeader action={<SettingsOutlinedIcon
                    className={classes.settingIcon} />} />
                <CardContent className={classes.cardText}>
                    <Typography variant='h6'>
                        {title}
                    </Typography>
                    <Typography variant='subtitle2' color="textSecondary">
                        One-on-one
                    </Typography>
                </CardContent>
                <Divider />
                <CardActions className={classes.cardFooter}>
                    <Typography variant="subtitle2">
                        <AccessTimeOutlinedIcon fontSize="small"
                            className={classes.icon} />
                            &nbsp;&nbsp;{duration} min
                    </Typography>
                    <Button variant="outlined"
                        className={classes.copyLinkBtn} id={url}
                        onClick={handleCopyLink}>
                        Copy link
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default function EventTypesTab() {
    const classes = useStyles();
    const [cardInfo, setCardInfo] = useState([]);
    useEffect(() => {
        let status;
        fetch("/event-types/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })
            .then(res => {
                status = res.status;
                if (status < 500) return res.json();
                else throw Error("Server error");
            })
            .then(res => {
                if (status === 200) setCardInfo(res);
                else throw Error("Fail to fetch data");
            })
            .catch(err => {
                alert(err.message);
            });
    }, []);
    const cards = cardInfo.map((card) =>
        <EventTypeCard key={card.id} url={card.url} title={card.title}
            duration={card.duration} color={card.color}   
        />
    );
    // need to add useEffect of fetching user info {name, url, photo} & BE route later
    return (
        <div className={classes.tabBackgorund}>
            <Grid container className={classes.tabBody}>
                <Grid item container direction="row">
                    <Grid item container direction="row" sm={6}>
                        <Grid item className={classes.imgContainer}>
                            <img src={Avatar} alt="Avatar" className={classes.avatar} />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2">
                                John Doe
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                calendapp.com/john-doe
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item sm={6} align="right"
                        className={classes.newEventBtnContainer}>
                        <EventTypeDialog />
                    </Grid>
                </Grid>
                <Grid item container direction="row" justify="flex-start"
                    alignItems="flex-start">
                    {cards}
                </Grid>
                <Grid item container direction="column" align="right" className={classes.footer}>
                    <Button variant="contained" color="primary" className={classes.startGuideBtn}>
                        Getting started guide
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}