import React, {Component, useState} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";
import VotingEventForm from "./voting_events/votingEventForm"
import VotingEventList from "./voting_events/votingEventList"
import VotingEventEdit from "./voting_events/votingEventEdit"
import VotingEventShow from "./voting_events/votingEventShow"
import PartyForm from "./parties/partyForm"
import PartyList from "./parties/partyList"
import PartyEdit from "./parties/partyEdit"
import PartyShow from "./parties/partyShow"
import CandidateForm from "./candidates/candidateForm"
import CandidateList from "./candidates/candidateList"
import CandidateEdit from "./candidates/candidateEdit"
import CandidateShow from "./candidates/candidateShow"
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
                        <Route path="/voting_events/:id" component={VotingEventShow}/>
                        <Route exact path="/voting_events" component={VotingEventList}/>
                        <Route path="/parties/create" component={PartyForm}/>
                        <Route path="/parties/update/:id" component={PartyEdit}/>
                        <Route path="/parties/:id" component={PartyShow}/>
                        <Route exact path="/parties" component={PartyList}/>
                        <Route path="/candidates/create" component={CandidateForm}/>
                        <Route path="/candidates/update/:id" component={CandidateEdit}/>
                        <Route path="/candidates/:id" component={CandidateShow}/>
                        <Route exact path="/candidates" component={CandidateList}/>
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
