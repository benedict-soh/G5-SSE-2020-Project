import axios from "axios";
import Cookies from 'js-cookie';
const BaseUrl = "http://127.0.0.1:5000";
const loginAPI = "/auth/login"; // POST
const logoutAPI= "/auth/logout"; // [POST, GET]
const authTestAPI= "/auth/test"; // GET

// post API request for login
export async function login_request(username, password) {
    const response = await axios.post(
        loginAPI,
        {"username" : username, "password" : password},
        {headers:{"Content-Type": "application/json"}}
        );
    console.log(response);
    return response.data
}

// post API request for logout
export async function logout_request() {
    const response = await axios.get(logoutAPI);
    return response.status
}


// post API request for logout
export async function authTest_request(token) {
    const response = await axios.get(authTestAPI);
    return response.status
}