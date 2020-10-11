import React, {Component} from "react";
import {theme} from "../utils/constants";
import TextField from "@material-ui/core/TextField";
import {ThemeProvider} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export default class loginPage extends Component {

    render() {
        return (
            <Grid container style={loginStyles.whiteBackground} >
                <Grid item xs={12}>
                    <LoginForm/>
                </Grid>
            </Grid>);

    }
}

export const loginStyles = {
    background: {
        // backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        padding: "0",
        margin: "0",
        backgroundPosition: "center center",
        minHeight: "100vh",
        overflow: "auto",
    },
    title: {
        top: '0px',
        margin: '0px',
    },
    whiteBackground: {
        display: "grid",
        maxWidth: "500px",
        margin: "7em auto",
        padding: "3em",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
    },
    headerTheme: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        color: "#18A0F1",
    },
    loaderStyle: {
        margin: "auto",
        width: "40px",
        padding: "16px",
    },
    subtitle: {
        textAlign: "center",
        fontSize: "16px",
        color: "#595959",
        maxWidth: "600px",
        marginTop: "16px",
    },
    userForm: {
        color: "black",
        fontSize: "24px",
    },
    confirmButton: {
        display: "flex",
        fontWeight: "bold",
        fontSize: "16px",
        background: "#458FFF",
        "&:hover": {
            background: "#458FEE"
        },
        borderRadius: 3,
        padding: "10px",
        color: "white",
        margin: "50px 0px 5px 0px",
    },
    loadingCircle: {
        marginTop: "16px",
    },
};

export const useStyles = makeStyles((theme) =>
    createStyles({
        userForm: {
            color: theme.palette.common.black,
            fontSize: "24px",
        },
        signupConfirm: {
            display: "flex",
            fontWeight: "bold",
            fontSize: "16px",
            background: "#458FFF",
            "&:hover": {
                background: "#458FEE"
            },
            borderRadius: 3,
            padding: "10px",
            color: "white",
            margin: "50px 0px 5px 0px",
        },
        loadingCircle: {
            marginRight: "8px",
        },
        inlineLink: {
            display: "inline-block",
        },
    })
)

function handleSubmit(event) {
    event.preventDefault();
}

function handleChange(event) {
    event.preventDefault();
}

function LoginForm(props) {
    const classes = useStyles();
    return (
        <div className={classes.userForm}>
            <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    < TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    < TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                </ThemeProvider>
                <Button className={classes.signupConfirm} variant="contained" type="submit" fullWidth
                        disabled={props.isLoading}>
                    {props.isLoading && <CircularProgress className={classes.loadingCircle} size="16px"/>}
                    {props.isLoading && "Logging In"}
                    {!props.isLoading && "Log In"}
                </Button>
            </form>
        </div>
    );
}