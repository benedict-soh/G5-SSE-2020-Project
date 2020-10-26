import {combineReducers, createStore} from "redux"


export const authActions = {
    login,
    logout,
    setAuth,
    resetAuth,
};

function setAuth(userType){
    return {type: AuthorisationActionTypes.USER_UPDATE_AUTH, payload: userType};
}

function resetAuth(){
    return {type: AuthorisationActionTypes.USER_NO_AUTH};
}

function login() {
    return { type: LoginActionTypes.USER_LOGGED_IN};
}

function logout() {
    return { type: LoginActionTypes.USER_LOGGED_OUT};
}

const LoginActionTypes = {
    //login actions
    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',
};

const AuthorisationActionTypes = {
    //authorisation actions
    USER_UPDATE_AUTH: 'USER_UPDATE_AUTH',
    USER_NO_AUTH: 'USER_NO_AUTH',
};



export const initialState = {
    isLoggedIn: false,
    authorisation: false,
};

const authReducer = (state = initialState, authActions) => {
    switch (authActions.type) {
        case LoginActionTypes.USER_LOGGED_IN:{
            return {...state, isLoggedIn: true};
        }
        case LoginActionTypes.USER_LOGGED_OUT:{
            return {...state, isLoggedIn: false};
        }
        case AuthorisationActionTypes.USER_UPDATE_AUTH:{
            return {...state, authorisation: authActions.payload};
        }
        case AuthorisationActionTypes.USER_NO_AUTH:{
            return {...state, authorisation: false};
        }
        default:
            return state;
    };
};

const rootReducer = combineReducers({authReducer});
const store = createStore(rootReducer);

export default store;
