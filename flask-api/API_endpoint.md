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
    "password" : "some string, not limitation/restrictions yet. Is salt hashed",
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

#### Get role

`/auth/get-role` methods=['GET']

Given a user has a valid JWT token, return the user's role as a string the body.

This is intended for authorisation checks on statically rendered page.

#### Test endpoint (will be around until we implement some real endpoints)

`/auth/test` methods=['POST', 'GET']

Will require a valid JWT Cookie and the CSRF header (See login for CSRF example).

## Voting Endpoints:

### Create

`/votes/create` methods=['POST']

Requires a JSON object with the following fields:
```json
{
    "v_event_id": "a number",
    "above": [
      {
        "party_id": "a number",
        "number": "a number"
      }
    ],
    "below": [
      {
        "candidate_id": "a number",
        "number": "a number"
      }
    ]
}
```

The `above` **OR** `below` fields _must_ be filled.
If the `above` field is filled, it **must contain 6 objects**.
If the `below` field is filled, it **must contain 12 objects**.
`v_event_id` must be a valid event ID.

Returns 201 upon success with no body.

If the date format needs to be changed, ping me (Ben) on Discord.

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

Returns 201 upon success with body:
```json
{
  "id": "a number"
}
```

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

### Get Events Not Voted In

`/voting-events/open` methods=['GET']

Returns 200 with a **list** of Voting Event IDs such as:
```json
{
  "v_event_id_list": "list of IDs"
}
```

Example:
```json
{
  "v_event_id_list": [1, 2, 3, 4]
}
```

### Tally

`/voting-events/{voting-event-ID}/tally` methods=['GET']

Returns 200 with a JSON object:
```json
{
    "above": [
      {
        "party_id": "a number",
        "votes": [
          {"a number in 1..{No. of Parties}": "a number"},
          {"a number in 1..{No. of Parties}": "a number"},
          ...
        ]
      },
      ...
    ],
    "below": [
      {
        "candidate_id": "a number",
        "votes": [
          {"a number in 1..{No. of Candidates}": "a number"},
          {"a number in 1..{No. of Candidates}": "a number"},
          ...
        ]
      },
      ...
    ],
    "total_above": "a number",
    "total_below": "a number",
    "total": "a number"
}
```
`total` is the sum of `total_above` and `total_below`.

Example Response:
```json
{
    "above": [
      {
        "party_id": 1,
        "votes": [
          {"1": 2},
          {"2": 0}
        ]
      },
      {
        "party_id": 2,
        "votes": [
          {"1": 0},
          {"2": 2}
        ]
      }
    ],
    "below": [
      {
        "candidate_id": 1,
        "votes": [
          {"1": 0},
          {"2": 1}
        ]
      },
      {
        "candidate_id": 2,
        "votes": [
          {"1": 1},
          {"2": 0}
        ]
      }
    ],
    "total_above": 2,
    "total_below": 1,
    "total": 3
}
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

Returns 201 upon success with body:
```json
{
  "id": "a number"
}
```

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
    "v_event_id": "an integer",
    "exclude": "boolean value"
}
```

Optional fields of `party_id` and `candidate_order` can be provided if the candidate belongs to a party:

```json
{
    "candidate_name": "a string",
    "v_event_id": "an integer",
    "party_id": "an integer",
    "exclude": "boolean value",
    "candidate_order": "an integer - must be a value from 1 to the total amount of party members"
}
```

Returns 201 upon success with body:
```json
{
  "id": "a number"
}
```

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
    "v_event_id": "an integer",
    "exclude": "boolean value"
}
```

Optional fields of `party_id` and `candidate_order` can be provided if the candidate belongs to a party:

```json
{
    "candidate_name": "a string",
    "v_event_id": "an integer",
    "party_id": "an integer",
    "exclude": "boolean value",
    "candidate_order": "an integer - must be a value from 1 to the total amount of party members"
}
```

Returns 204 upon success.

### Delete

`/candidates/{candidate-ID}/delete` methods=['DELETE']

Returns 204 upon success.
