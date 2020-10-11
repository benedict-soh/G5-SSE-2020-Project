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

## Voting Event Endpoints:

### Create

`/voting-events/create` methods=['POST']

Requires a JSON object with the following fields:
```json
{
    "event_name" : "a string",
    "year" : "a year, e.g. 2020",
    "vote_start" : "a date in the format of 'YYYY-MM-DD'",
    "vote_end" : "a date in the format of 'YYYY-MM-DD'"
}
```

Returns 204 upon success.

If the date format needs to be changed, ping me (Ben) on Discord.

### Get by ID

`/voting-events/{voting-event-ID}` methods=['GET']

Returns 200 with a JSON object with the following fields:
```json
{
    "id" : "an integer",
    "event_name" : "a string",
    "year" : "a year, e.g. 2020",
    "vote_start" : "a date in the format of 'YYYY-MM-DD HH:MM:SS'",
    "vote_end" : "a date in the format of 'YYYY-MM-DD HH:MM:SS'"
}
```

### Get All

`/voting-events` methods=['GET']

Returns 200 with a **list** of JSON objects such as:
```json
[
  {
      "id" : "an integer",
      "event_name" : "a string",
      "year" : "a year, e.g. 2020",
      "vote_start" : "a date in the format of 'YYYY-MM-DD HH:MM:SS'",
      "vote_end" : "a date in the format of 'YYYY-MM-DD HH:MM:SS'"
  }
]
```

### Update

`/voting-events/{voting-event-ID}/update` methods=['PUT']

Requires a JSON object with the following fields:
```json
{
    "event_name" : "a string",
    "year" : "a year, e.g. 2020",
    "vote_start" : "a date in the format of 'YYYY-MM-DD'",
    "vote_end" : "a date in the format of 'YYYY-MM-DD'"
}
```

Returns 204 upon success.

### Delete

`/voting-events/{voting-event-ID}/delete` methods=['DELETE']

Returns 204 upon success.

## Party Endpoints:

### Create

`/parties/create` methods=['POST']

Requires a JSON object with the following fields:
```json
{
    "party_name" : "a string",
    "v_event_id" : "a Voting Event ID (Integer)"
}
```

Returns 204 upon success.

### Get by ID

`/parties/{party-ID}` methods=['GET']

Returns 200 with a JSON object with the following fields:
```json
{
    "id": "an integer",
    "party_name": "a string",
    "v_event_id": "an integer"
}
```

### Get All

`/parties` methods=['GET']

Optional parameters can be provided:
- `party_name` : A String
- `v_event_id` : An integer

Example: `localhost:5000/parties?party_name=CCP&v_event_id=3`

Returns 200 with a **list** of JSON objects such as:
```json
[
  {
      "id": "an integer",
      "party_name": "a string",
      "v_event_id": "an integer"
  }
]
```

### Update

`/parties/{party-ID}/update` methods=['PUT']

Requires a JSON object with the following fields:
```json
{
    "party_name" : "a string",
    "v_event_id" : "a Voting Event ID (Integer)"
}
```

Returns 204 upon success.

### Delete

`/parties/{party-ID}/delete` methods=['DELETE']

Returns 204 upon success.

## Candidate Endpoints:

### Create

`/candidates/create` methods=['POST']

Requires a JSON object with the following fields:
```json
{
    "candidate_name": "a string",
    "v_event_id": "an integer"
}
```

An optional field of `party_id` can be provided if the candidate belongs to a party:

```json
{
    "candidate_name": "a string",
    "v_event_id": "an integer",
    "party_id": "an integer"
}
```

Returns 204 upon success.

### Get by ID

`/candidates/{candidate-ID}` methods=['GET']

Returns 200 with a JSON object with the following fields:
```json
{
    "id": "an integer",
    "candidate_name": "a string",
    "party_id": "an integer OR null",
    "v_event_id": "an integer"
}
```

### Get All

`/candidates` methods=['GET']

Optional parameters can be provided:
- `candidate_name` : A String
- `v_event_id` : An integer
- `party_id` : An integer

Example: `localhost:5000/candidates?party_id=1`

Returns 200 with a **list** of JSON objects such as:
```json
[
  {
      "id": "an integer",
      "candidate_name": "a string",
      "party_id": "an integer OR null",
      "v_event_id": "an integer"
  }
]
```

### Update

`/candidates/{candidate-ID}/update` methods=['PUT']

Requires a JSON object with the following fields:
```json
{
    "candidate_name": "a string",
    "v_event_id": "an integer"
}
```

An optional field of `party_id` can be provided if the candidate belongs to a party:

```json
{
    "candidate_name": "a string",
    "v_event_id": "an integer",
    "party_id": "an integer"
}
```

Returns 204 upon success.

### Delete

`/candidates/{candidate-ID}/delete` methods=['DELETE']

Returns 204 upon success.
