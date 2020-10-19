import React, {Component} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";
import VotingEventForm from "./voting_events/votingEventForm"
import VotingEventList from "./voting_events/votingEventList"
import VotingEventEdit from "./voting_events/votingEventEdit"
import axios from "axios"
import loginPage from "./login/login";

class App extends Component {
    constructor(props){
        super(props)
    }

    componentWillMount() {
        this.check_auth()
    }

    //check authentication
    check_auth() {
        console.log("checking")
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

export default withRouter(App);
