import React, {Component} from 'react';
import {AppBar, createStyles, fade, Tabs, Theme, Toolbar, createMuiTheme, Tab} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { NavLink } from "react-router-dom";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";

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
}

function LoginAvatar(props) {
  const classes = useStyles();
  return (
      <ThemeProvider theme={theme}>
          <NavLink exact to={props.to} className={classes.leftTab}>
              <Button className={classes.loginButton}>{props.label}</Button>
          </NavLink>
      </ThemeProvider>
  );
}

export default function NavigationTopBar(props) {
    const classes = useStyles();
    return (
        <AppBar position="static" className={classes.root}>
            <div className={classes.navWrapper}>
                <div className={classes.logoWrapper}>
                    <img src="https://aec.gov.au/_template/css/img/aec-logo-homepage.png" alt="logo" className={classes.logo}/>
                </div>
                <Toolbar value= {false} className={classes.tab}>
                    <Tabs className={classes.tabs} fullWidth={true}>
                        <NavigationBarOption label={"Home"} to={"/"} />
                        <NavigationBarOption label={"For Voters"} to={"/vote"} />
                        <NavigationBarOption label={"For Parties"} to={"/parties"} />
                    </Tabs>
                    <LoginAvatar label={"Login"} to={"/login"} />
                </Toolbar>
            </div>
        </AppBar>
    )
}