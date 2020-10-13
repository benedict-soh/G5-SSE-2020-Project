import React, {Component} from 'react';
import NavigationTopBar from './navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import './App.css';
import voterRoutes from "./routes/voterRoutes";
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
