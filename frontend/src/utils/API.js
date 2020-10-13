import axios from "axios";

const BaseUrl = "http://127.0.0.1:5000"
const loginAPI = "/auth/login" // POST
const logoutAPI= "/auth/logout" //[POST, GET]

// post API request for login
export async function login_request(username, password) {
    const response = await axios.post(
        BaseUrl + loginAPI,
        {"username" : username, "password" : password},
        {headers:{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}}
        )
    return response.data
}

// post API request for logout
export async function logout_request() {
    const response = await axios.post(
        BaseUrl + logoutAPI,
        {},
        {headers:{"Content-Type": "application/json"}}
    )
    return response.data
}