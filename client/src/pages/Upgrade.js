import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Header from '../components/Header';
import CheckIcon from '@material-ui/icons/Check'
import StripeCheckoutModal from '../components/stripe/StripeCheckoutModal';
import StripeCancelModal from '../components/stripe/StripeCancelModal';
import { UserContext } from '../globals/UserContext';
import { AlertContext } from '../globals/AlertContext';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },

  link: {
    margin: theme.spacing(1, 1.5),
  },

  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },

  title: {
    fontSize:40,
    color:"secondary" 
  },

  card: {
    width:350,
    margin: '0 auto 40px auto',
  },

  cardHeader_premium: {
    paddingTop:50,
    marginBottom:13,
    backgroundColor:theme.bgcolor,
    color:theme.palette.purple.main
  },

  cardHeader_professional: {
    paddingTop:50,
    marginBottom:13,
    backgroundColor:theme.bgcolor,
    color:theme.palette.green.main
  },

  cardAction: {
      marginBottom:35
  },

  cardButton: {
    margin:"auto", 
    width:150,
    height:50,
    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.bgcolor
   }
  },

  cardContent: {
      height:170,
      color:theme.palette.light.minorLight,
      padding:'30px 40px 60px 40px',
  },

  checkIcon: {
    color:theme.palette.primary.main,
    fontSize:15,
    marginRight:10
  }
}));


export default function Upgrade() {
  const classes = useStyles();

  const userContext = useContext(UserContext)
  const alertContext = useContext(AlertContext)

  const [openModal, setOpenModal] = useState(false)

  const [planType, setPlanType] = useState(userContext.isSubscribed?"premium":"free basic")

  const [buttonToDisable, setButtonToDisable] = useState(userContext.isSubscribed?1:0)

  const user_id = userContext.userId

  const [email, setEmail] = useState();
  const [name, setName] = useState('');
  
  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect( ()=>{
    let status=200
    fetch(`/user/${user_id}/email`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials:"include"
        })
        .then((res) => {
            status = res.status
            if (status < 500)
                return res.json()
            else throw Error("Server error");
        })
        .then((data) => {
            if (status === 200) {
              setEmail(data.email);
              setName(data.name);
            } else throw Error("User email not set");
        })
        .catch(err => {
            alertContext.setAlertStatus({
                isOpen:true,
                message:err.message,
                type:"error"
                })    
        });
},[])

  const tiers = [
    {
      title: 'Standard',
      price: 'Free',
      description: [
        'Maximum 3 event types',
        'Group meetings',
      ],
      buttonText: 'Downgrade',
      buttonVariant: 'outlined',
    },
    {
      title: 'Premium',
      price: '12',
      description: [
          'Unlimited event types',
          'Group meetings',
          '6 calendar connections'
      ],
      buttonText: 'Upgrade',
      buttonVariant: 'outlined',
    },
  ];

  const showModal = ()=> {
    if (userContext.isSubscribed)
      return <StripeCancelModal open={openModal} handleClose={handleClose} email={email}/>
    else
      return <StripeCheckoutModal open={openModal} handleClose={handleClose} email={email}/>
  }


  return (
    <>
      <CssBaseline />
      <Header name={name} />
      {showModal()}
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h4" align="center" gutterBottom className={classes.title}>
          Choose your account
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" component="p">
          {/* Need to figure out what plan the user is currently on */}
            {`You are on the ${planType} plan`}
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container justify="space-evenly" >
          {tiers.map((tier,index) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} md={5} >
              <Card className={classes.card}>
                <CardHeader
                  title={tier.title}
                  subheader={index===0?tier.price:`$${tier.price}/month`}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center', color:"secondary", variant:"body1" }}
                  className={index===0?classes.cardHeader_premium:classes.cardHeader_professional}
                />
                <CardActions className={classes.cardAction}>
                  <Button className={classes.cardButton} variant={tier.buttonVariant} color="primary" disabled={index===buttonToDisable} onClick={handleClickOpen}>
                    {tier.buttonText}
                  </Button>
                </CardActions>
                <Divider/>
                <CardContent className={classes.cardContent}>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography component="li" variant="subtitle1" align="left" key={line}>
                        <CheckIcon className={classes.checkIcon}></CheckIcon>{line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}