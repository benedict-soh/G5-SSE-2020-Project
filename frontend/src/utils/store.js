import {combineReducers, createStore} from "redux"


export const authActions = {
    check_login,
    login,
    logout,
};

function check_login() {

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



export const initialState = {
    isLoggedIn: false,
};

const authReducer = (state = initialState, authActions) => {
    switch (authActions.type) {
        case LoginActionTypes.USER_LOGGED_IN:{
            return {...state, isLoggedIn: true};
        }
        case LoginActionTypes.USER_LOGGED_OUT:{
            return {...state, isLoggedIn: false};
        }
        default:
            return state;
    };
};

const rootReducer = combineReducers({authReducer});
const store = createStore(rootReducer);

export default store;