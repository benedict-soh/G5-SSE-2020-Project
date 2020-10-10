# Flask API supported endpoints (WIP)

The endpoint will follow the syntax of `/things/more-things` as the base URL will differ based on the environment.

For local testing, the API can be found at: http://127.0.0.1:5000/ (HTTPS coming soon)

## Auth Endpoints:

The JWT token in the Cookie will be valid for 15 minutes.

#### Register a user (should NOT be used for frontend, developer testing only)

`/auth/register` methods=['POST']

Requires a JSON object with the following fields:
```json
{
    "username" : "some username, must be unique",
    "password" : "some string, not limitation/restrictions yet. Is salt hased",
    "full_name" : "some name",
    "user_type" : "voter/commissioner"
}
```
You will still need to login after register.

#### Login

`/auth/login` methods=['POST']

Requires a JSON object with the following fields:
```json
{
    "username" : "some username",
    "password" : "some password"
}
```
Will return with a HttpOnly Cookie with JWT info, which is completely abstracted away for frontend apes.

Will also return a non-HttpOnly Cookie named `csrf_access_token`, and the frontend devs will need to read the value and put the content in the followin request headers:

`"X-CSRF-TOKEN" : "the token value"`

#### Logout

`/auth/logout` methods=['POST', 'GET']

Will strip away both of the provided Cookies.


#### Test endpoint (will be around until we implement some real endpoints)

`/auth/test` methods=['POST', 'GET']

Will require a valid JWT Cookie and the CSRF header (See login for CSRF example).