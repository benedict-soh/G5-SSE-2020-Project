import React, {Component, useState} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";
import VoteCreate from "./votes/voteCreate"
import VoteList from "./votes/voteList"
import VotingEventForm from "./voting_events/votingEventForm"
import VotingEventList from "./voting_events/votingEventList"
import VotingEventEdit from "./voting_events/votingEventEdit"
import VotingEventShow from "./voting_events/votingEventShow"
import PartyCreate from "./parties/partyCreate"
import PartyList from "./parties/partyList"
import PartyEdit from "./parties/partyEdit"
import PartyShow from "./parties/partyShow"
import CandidateCreate from "./candidates/candidateCreate"
import CandidateList from "./candidates/candidateList"
import CandidateEdit from "./candidates/candidateEdit"
import CandidateShow from "./candidates/candidateShow"
import loginPage from "./login/login";
import {authTest_request} from "./utils/API";
import connect from "react-redux/lib/connect/connect";
import {authActions} from "./utils/store";
import { loadReCaptcha } from 'react-recaptcha-google'
import LogoutPage from "./login/logout";

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

    componentDidMount() {
        loadReCaptcha();
    }

    //check authentication
    checkAuth(){
        authTest_request()
            .then(
                (r) => {
                    if (r && r.status && r.status === 200){
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
                <NavigationTopBar {...this.props}/>
                    <Switch>
                        {/* add new routes inside this switch */}
                        <Route path="/vote/:id" component={VoteCreate}/>
                        <Route exact path="/vote" component={VoteList}/>
                        <Route path="/voting_events/:id/candidates" component={CandidateList}/>
                        <Route path="/voting_events/:id/parties" component={PartyList}/>
                        <Route path="/voting_events/create" component={VotingEventForm}/>
                        <Route path="/voting_events/update/:id" component={VotingEventEdit}/>
                        <Route path="/voting_events/:id" component={VotingEventShow}/>
                        <Route exact path="/voting_events" component={VotingEventList}/>
                        <Route path="/parties/create/:id" component={PartyCreate}/>
                        <Route path="/parties/update/:id" component={PartyEdit}/>
                        <Route path="/parties/:id" component={PartyShow}/>
                        <Route path="/candidates/create/:id" component={CandidateCreate}/>
                        <Route path="/candidates/update/:id" component={CandidateEdit}/>
                        <Route path="/candidates/:id" component={CandidateShow}/>
                        <Route strict path="/login" component={loginPage}/>
                        <Route strict path="/logout" component={LogoutPage}/>
                    </Switch>
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
    authorisation: state.authReducer.authorisation,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))
