import React, {Component} from 'react';
import {AppBar, createStyles, fade, Tabs, Theme, Toolbar, createMuiTheme, Tab} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Oswald, Arial',
        fontSize: 18,
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: fade(theme.palette.common.white, 0.15)
        },
        navWrapper:{
            minWidth: "992px"
        },
        navlink: {
            color: theme.palette.common.black,
            textDecoration: "none",
        },
        logoWrapper:{
            marginTop: "25px",
            height: "100px",
            width: "100%",
        },
        logo:{
            display: "block",
            maxWidth: "100%",
        },
        tabs: {
            display: "block",
        },
        tab: {
            textTransform: "none",
        }

    })
);

function NavigationBarOption(props) {
  const classes = useStyles();
  return (
      <ThemeProvider theme={theme}>
          <NavLink to={props.to} className={classes.navlink}>
              <Tab label={props.label} className={classes.tab}/>
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
                <Toolbar>
                    <Tabs value={false} className={classes.tabs}>
                        <NavigationBarOption label={"Home"} to={"/"} />
                        <NavigationBarOption label={"For Voters"} to={"/vote"} />
                        <NavigationBarOption label={"For Parties"} to={"/parties"} />
                    </Tabs>
                </Toolbar>
            </div>
        </AppBar>
    )
}