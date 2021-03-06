import React, {Component, useEffect, useState} from "react";
import {theme} from "../utils/constants";
import TextField from "@material-ui/core/TextField";
import {ThemeProvider} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {authTest_request, get_role, login_request} from "../utils/API";
import {Alert} from '@material-ui/lab';
import { Redirect } from "react-router-dom";
import {authActions} from "../utils/store";
import connect from "react-redux/lib/connect/connect";
import { ReCaptcha } from 'react-recaptcha-google'

class loginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPageLoading: true,
            isLoading: false,
            isRobot: true,
            error: "",
            authorisation: false,
            isloadingRedirect: true,
        };
        this.login = this.login.bind(this);
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
    }
    componentWillMount() {
        this.checkAuth();
        this.checkRole();
    }
    componentDidMount() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }

    // the main login function that handles responses
    login(username, password) {
        this.setState({isLoading: true, error: ""});
        if (!this.state.isRobot) {
            login_request(username, password)
                .then(r => {
                    this.props.login();
                    this.checkRole();
                }).catch((err) => {
                this.setState({isLoading: false, error: err.message});
            })
        }else{
            this.setState({isLoading: false, error: "please verify that you are not a robot"});
        }

    }

    checkAuth(){
        authTest_request()
            .catch((err) => {
                this.props.logout();
                this.setState({isPageLoading: false})
            }).then(
                (r) => {
                    if(r && r.status && r.status === 200){
                        this.props.login();
                         this.setState({isPageLoading: false})
                    }
                });
    }

    checkRole() {
        get_role()
            .catch(err => {
                this.setState({authorisation: false, isloadingRedirect: false});
            }).then(r => {
            if (r && r.status && r.status === 200) {
                this.setState({authorisation: r.data, isloadingRedirect: false});
                this.props.setAuth(r.data);
            }
        });

    }

    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
            this.setState({isRobot: true})
        }
    }
    verifyCallback(recaptchaToken) {
        // Here you will get the final recaptchaToken!!!
        this.setState({isRobot: false})
    }

    render() {
        if (this.state.isPageLoading || this.state.isloadingRedirect) {
            return <><h1>loading...</h1><CircularProgress size="72px"/></>;
        }
        if (this.props.isLoggedIn && this.state.authorisation === "voter") {
            return <Redirect push to="/vote"/>
        }
        if (this.props.isLoggedIn && this.state.authorisation === "commissioner") {
            return <Redirect push to="/voting_events"/>
        }
        return (
            <Grid container style={loginStyles.whiteBackground}>
                <Grid item xs={12}>
                    {this.state.error && <Alert severity="error">{this.state.error}</Alert>}
                    <LoginForm isLoading={this.state.isLoading} isError={this.state.error} login={this.login}/>
                    <ReCaptcha
                        ref={(el) => {
                            this.captchaDemo = el;
                        }}
                        size="normal"
                        data-theme="dark"
                        render="explicit"
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onloadCallback={this.onLoadRecaptcha}
                        verifyCallback={this.verifyCallback}
                    />
                </Grid>
            </Grid>
        );

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
);



function LoginForm(props) {

    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        if (username && password) {
            props.login(username, password);
        }
    }

    function handleChange(event) {
        event.preventDefault();
        if (event.currentTarget.name.toString() === "username") {
            setUsername(event.currentTarget.value);
        } else if (event.currentTarget.name.toString() === "password") {
            setPassword(event.currentTarget.value);
        }
    }


    // empty the password field if there is an error
    useEffect(() => {
        setPassword("");
    },[props.isError]);


    return (
        <div className={classes.userForm}>
            <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    < TextField
                        value={username}

                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={handleChange}
                    />
                    < TextField
                        value={password}
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

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(authActions.logout()),
    login: () => dispatch(authActions.login()),
    setAuth: (auth) => dispatch(authActions.setAuth(auth)),
});

const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
    authorisation: state.authReducer.authorisation,
});

export default connect(mapStateToProps, mapDispatchToProps)(loginPage)
