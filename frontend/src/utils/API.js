import axios from "axios";
const loginAPI = "/auth/login"; // POST
const logoutAPI= "/auth/logout"; // [POST, GET]
const authTestAPI= "/auth/test"; // GET
const getRoleAPI = "/auth/get-role"; // GET
axios.defaults.timeout = 2000;


// post API request for login
export async function login_request(username, password) {
    const response = await axios.post(
        loginAPI,
        {"username" : username, "password" : password},
        {headers:{"Content-Type": "application/json"}}
        );
    return response.data;
}

// post API request for logout
export async function logout_request() {
    const response = await axios.get(logoutAPI);
    return response.status;
}


// post API request for logout
export async function authTest_request() {
    return await axios.get(authTestAPI);
}

// get API request for authorisation
export async function get_role() {
    return await axios.get(getRoleAPI);
}