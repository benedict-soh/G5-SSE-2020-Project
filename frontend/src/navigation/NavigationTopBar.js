import React, {Component} from 'react';
import {AppBar, createStyles, fade, Tabs, Theme, Toolbar, createMuiTheme, Tab} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { NavLink } from "react-router-dom";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import connect from "react-redux/lib/connect/connect";
import {logout_request, get_role} from "../utils/API";
import {authActions} from "../utils/store";

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Oswald, Arial',
        fontSize: 18,
        textAlign: "center"
    },
});
const primaryColor = '#702c8c'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            width: "100%"
        },
        navWrapper:{
            minWidth: "992px"
        },
        navLink: {
            color: theme.palette.common.black,
            textDecoration: "none",
            '&:hover': {
                color: primaryColor,
                opacity: 1,
            },
        },
        logoWrapper:{
            paddingTop: "25px",
            paddingLeft: "80px",
            height: "100px",
        },
        logo:{
            display: "block",
            maxWidth: "100%",
        },
        tabs: {
            paddingLeft: "100px",
            display: "block",
            flexGrow: "1",
        },
        tab: {
            textTransform: "none",
        },
        leftTab: {
            textTransform: "none",
            textDecoration: "none",
            display: "block",
            marginRight: "200px",
        },
        loginButton: {
            textTransform: "none",
            fontSize: "14px",
            color: "white",
            fontWeight: "bold",
            opacity: 1,
            backgroundColor: primaryColor,
            '&:hover': {
                color: "white",
                fontWeight: "bold",
                opacity: "0.8",
                backgroundColor: primaryColor,
            },
        },
        logoutButton: {
            textTransform: "none",
            fontSize: "14px",
            color: "white",
            fontWeight: "bold",
            opacity: 1,
            backgroundColor: "red",
            '&:hover': {
                color: "white",
                fontWeight: "bold",
                opacity: "0.8",
                backgroundColor: "red",
            },
        },

    })
);

function NavigationBarOption(props) {
  const classes = useStyles();
  return (
      <ThemeProvider theme={theme}>
          <NavLink exact to={props.to} className={classes.navLink} activeStyle={{ color: '#702c8c', opacity: "1", fontWeight: "bold" }}>
              <Tab label={props.label} className={classes.tab}/>
          </NavLink>
      </ThemeProvider>
  );
};

function LoginAvatar() {
  const classes = useStyles();
  return (
      <ThemeProvider theme={theme}>
          <NavLink exact to={"/login"} className={classes.leftTab}>
              <Button className={classes.loginButton}>Log in</Button>
          </NavLink>
      </ThemeProvider>
  );
};

function LogoutAvatar(props) {
  const classes = useStyles();
  return (
      <ThemeProvider theme={theme}>
          <div className={classes.leftTab}>
              <Button className={classes.logoutButton} onClick={() => logout(props)}>Log out</Button>
          </div>
      </ThemeProvider>
  );
};

function logout(props){
    logout_request()
        .then(
        (r) => {
            if (r === 200){
                props.logout();
                props.history.push("/logout");
            }
        }).catch((err) => {
            console.log(err);
    });
}

function NavigationTopBar(props) {
    const classes = useStyles();
    const isLoggedIn = props.isLoggedIn;
    const authorisation = props.authorisation;
    return (
        <AppBar position="static" className={classes.root}>
            <div className={classes.navWrapper}>
                <div className={classes.logoWrapper}>
                    <img src="https://aec.gov.au/_template/css/img/aec-logo-homepage.png" alt="logo" className={classes.logo}/>
                </div>
                <Toolbar value= {false} className={classes.tab}>
                    <Tabs className={classes.tabs} fullWidth={true}>
                        {isLoggedIn?
                        <>
                            <NavigationBarOption label={"Home"} to={"/"} />
                            {authorisation == "voter" &&
                              <NavigationBarOption label={"Events"} to={"/vote"} />
                            }
                            {authorisation == "commissioner" &&
                              <NavigationBarOption label={"Events"} to={"/voting_events"} />
                            }
                        </>
                        :
                        <NavigationBarOption label={"Home"} to={"/"} />
                        }
                    </Tabs>
                    {props.isLoggedIn? <LogoutAvatar logout={props.logout} {...props} /> : <LoginAvatar/>}
                </Toolbar>
            </div>
        </AppBar>
    )
};

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(authActions.logout()),
});

const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
    authorisation: state.authReducer.authorisation,
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationTopBar);
