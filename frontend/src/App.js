import React, {Component, useState} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";
import VotingEventForm from "./voting_events/votingEventForm"
import VotingEventList from "./voting_events/votingEventList"
import VotingEventEdit from "./voting_events/votingEventEdit"
import loginPage from "./login/login";
import {authTest_request} from "./utils/API";
import connect from "react-redux/lib/connect/connect";
import {authActions} from "./utils/store";

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            error: "",
        };
    }

    componentWillMount() {
        if (this.checkAuth() === true){
            this.setState({isLoggedIn: true})
        }
    }

    //check authentication
    checkAuth(){
        authTest_request()
            .then(
                (r) => {
                    if (r === 200){
                        this.props.login();
                    }
                }).catch((err) => {
            console.log(err)
            this.props.logout();
        });
    }

    render() {
        return (
            <div className="App">
                <NavigationTopBar/>
                    <Switch>
                        {/* add new routes inside this switch */}
                        <Route strict path="/vote" component={voterRoutes}/>
                        <Route path="/voting_events/create" component={VotingEventForm}/>
                        <Route path="/voting_events/update/:id" component={VotingEventEdit}/>
                        <Route exact path="/voting_events" component={VotingEventList}/>
                        <Route strict path="/login" component={loginPage}/>
                    </Switch>
                    <a
                        className="App-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Login to Vote
                    </a>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(authActions.logout()),
    login: () => dispatch(authActions.login()),
});


const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))