import React, {Component} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";
import EventForm from "./test/voteEventForm"
import EventList from "./test/voteEvent"
import EventEdit from "./test/voteEventEdit"

class App extends Component {

    render() {
        return (
            <div className="App">
                <NavigationTopBar/>
                    <Switch>
                        <Route strict path="/vote" component={voterRoutes}/>
                        <Route path="/event/create" component={EventForm}/>
                        <Route path="/event/update/:id" component={EventEdit}/>
                        <Route exact path="/event" component={EventList}/>
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
