import React, { useState, useEffect, useContext } from 'react';
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
import { AlertContext } from '../globals/AlertContext';
import { UserContext } from '../globals/UserContext';

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
    const { color, duration, title, url, userUrl } = props;
    const [link, setLink] = useState(url);

    const alertContext = useContext(AlertContext)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`calendapp.com/calendar/${userUrl}/${link}`)
            .then(() => {
                alertContext.setAlertStatus({
                    isOpen: true,
                    message: "Copied: " + link,
                    type: "info"
                })
            }, () => {
                alertContext.setAlertStatus({
                    isOpen: true,
                    message: "Fail to copy, Please copy manually",
                    type: "error"
                })
            });
    };
    return (
        <Grid item xs={12} sm={12} md={6} lg={4}>
            <Card className={classes.cardBody}>
                <div className={classes.colorTag} style={{ background: color }}></div>
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

export default function EventTypesTab(props) {
    const classes = useStyles();
    const [cardInfo, setCardInfo] = useState([]);

    const alertContext = useContext(AlertContext);
    const userContext = useContext(UserContext);
    const userId = userContext.userId
    const {name, setName, userUrl, setUserUrl} = props;

    useEffect(() => {
        let status;
        fetch(`/event-types/${userId}`, {
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
                if (status === 200) {
                    setCardInfo(res.eventTypes);
                    setUserUrl(res.url);
                    setName(res.name)
                } 
                else throw Error("Fail to fetch data");
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen: true,
                    message: err.message,
                    type: "error"
                })
            });
    }, []);
    const cards = () => {
        if (cardInfo !== []) return (
            cardInfo.map((card) =>
                <EventTypeCard key={card.id} url={card.url} title={card.title}
                    duration={card.duration} color={card.color} userUrl={userUrl}
                />
            )
        )
    }
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
                                {name}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                calendapp.com/{userUrl}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item sm={6} align="right"
                        className={classes.newEventBtnContainer}>
                        <EventTypeDialog setCardInfo={setCardInfo} />
                    </Grid>
                </Grid>
                <Grid item container direction="row" justify="flex-start"
                    alignItems="flex-start">
                    {cards()}
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