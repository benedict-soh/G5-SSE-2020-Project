import React, {Component} from "react";
import {authTest_request, get_role} from "../utils/API";
import {authActions} from "../utils/store";
import connect from "react-redux/lib/connect/connect";
import CircularProgress from "@material-ui/core/CircularProgress";

// use this HOC wrapper around components that require authentication and authorisation to access
// WrappedComponent is the function/class/component you wish to protect
// role is a string that is either "commissioner" or "voter"
// if you wish to protect, say, create party, then you you use the role "commissioner" as it is commissioner only

export function withAuthorisation(WrappedComponent, role) {
    class AuthWrapper extends Component {
        constructor(props) {
            super(props);
            this.checkAuth = this.checkAuth.bind(this);
            this.checkRole = this.checkRole.bind(this);
            this.state ={
                authenticated: false,
                authorisation: false,
                loadingAuthentication: true,
                loadingAuthorisation: true,
            }
        };

        componentWillMount() {
            this.checkAuth();
            this.checkRole();
        }

        checkAuth(){
            authTest_request()
                .catch(err => {
                    this.props.logout();
                    this.setState({authenticated: false, loadingAuthentication: false});
                }).then(r => {
                    if(r && r.status && r.status === 200){
                        this.props.login();
                        this.setState({authenticated: true, loadingAuthentication: false});
                    }
            });

        }

        checkRole(){
            get_role()
                .catch(err => {
                    this.setState({authorisation: false, loadingAuthorisation: false});
                }).then(r => {
                    if(r && r.status && r.status === 200){
                        this.setState({authorisation: r.data, loadingAuthorisation: false});
                    }
                });

        }

        render() {
            if(this.state.loadingAuthorisation || this.state.loadingAuthentication){
                return <><h1>loading...</h1><CircularProgress size="72px"/></>;
            }
            if(this.state.authenticated && this.state.authorisation === role){
                return <WrappedComponent {...this.props} />;
            }else if(this.state.authenticated === false){
                return <h1>Something went wrong. Please login</h1>;
            }else{
                return <h1>Forbidden!</h1>;
            }

        };
    };

    const mapDispatchToProps = (dispatch) => ({
        logout: () => dispatch(authActions.logout()),
        login: () => dispatch(authActions.login()),
        setAuth: (auth) => dispatch(authActions.setAuth(auth)),
    });

    const mapStateToProps = (state) => ({
        isLoggedIn: state.authReducer.isLoggedIn,
        authorisation: state.authReducer.authorisation,
    });

    return connect(mapStateToProps, mapDispatchToProps)(AuthWrapper);
}
