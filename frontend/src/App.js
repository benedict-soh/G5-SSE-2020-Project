import React, {Component} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";

class App extends Component {
    render() {
        return (
            <div className="App">
                <NavigationTopBar/>
                    <Switch>
                        <Route strict path="/vote" component={voterRoutes}/>
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
