import axios from "axios";
import Cookies from 'js-cookie';

const loginAPI = "/auth/login"; // POST
const logoutAPI= "/auth/logout"; // [POST, GET]
const authTestAPI= "/auth/test"; // GET
const getRoleAPI = "/auth/get-role"; // GET
const votingEventsAPI = "/voting-events" // [GET, PUT, DELETE]
const partyAPI = "/parties" // [GET, PUT, DELETE]
const candidateAPI = "/candidates" // [GET, PUT, DELETE]
const getNotVotedAPI = "/voting-events/open" // [GET]
const createPartyAPI = "/parties/create" // POST
const createCandidateAPI = "/candidates/create" // POST
const createVoteAPI = "/votes/create"; // POST
const createVoteEventAPI = "/voting-events/create"; // POST
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
    const response = await axios.get(logoutAPI, {
      headers: {
        "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
      },
    });
    return response.status;
}


// post API request for testing authentication
export async function authTest_request() {
    return await axios.get(authTestAPI, {
      headers: {
        "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
      },
    });
}

// get API request for authorisation
export async function get_role() {
    return await axios.get(getRoleAPI, {
      headers: {
        "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
      },
    });
}

// post API for creating vote
export async function create_vote(newVote) {
  return await fetch("/votes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(newVote)
  });
}

// get information about ballot
export async function get_ballot(id) {
  var parties;
  var candidates;

  var candidatesArr = {};
  candidatesArr[null] = [];

  await fetch(partyAPI+'?v_event_id='+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      parties = data;
      return fetch('/candidates?v_event_id='+id, {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      candidates = data;
    })
  );

  return {candidates: candidates, parties: parties};
}

// post API for creating Candidate
export async function create_candidate(newCandidate) {
  return await fetch(createCandidateAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(newCandidate)
  });
}

// put API for updating Candidate
export async function update_candidate(candidate_id, updateCandidate) {
  return await fetch(candidateAPI+candidate_id+"/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(updateCandidate)
  });
}

// put API for updating Party
export async function update_party(party_id, updateParty) {
  return await fetch(partyAPI+"/"+party_id+"/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(updateParty)
  });
}

// put API for updating event
export async function update_event(event_id, updateEvent) {
  return await fetch(votingEventsAPI+"/"+event_id+"/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(updateEvent)
  });
}

// get only basic information about candidate
export async function get_candidate(id) {
  var candidate;

  await fetch('/candidates/'+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      candidate = data;
    })
  );

  return candidate;
}

// get API for showing a specific candidate as well as the voting event and party information;
export async function get_candidate_all(id) {
  var party;
  var votingEvent;
  var candidate;

  var party_id;
  await fetch(candidateAPI+"/"+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      candidate = data;
      if(data.candidate_order == null) candidate.candidate_order = "N/A";
      party_id = data.party_id;
      return fetch(votingEventsAPI+"/"+data.v_event_id, {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      votingEvent = data;
      return fetch(partyAPI+"/"+party_id, {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      party = data;
    })
  );

  return {candidate: candidate, party: party, votingEvent: votingEvent};
}

// get API for showing a specific candidate as well as the voting event and party information;
export async function get_event_tally(id) {
  var partyDict;
  var parties;
  var tally;
  var candidates;

  await fetch('/candidates?v_event_id='+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      candidates = data;
      return fetch('/parties?v_event_id='+id, {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      parties = data;
      return fetch('/voting-events/'+id+'/tally', {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      tally = data;
    })
  );

  return {candidates: candidates, parties: parties, tally: tally};
}

// get API for showing candidates
export async function get_candidates(event_id = -1) {
  var extra = '?v_event_id='+event_id;
  var candidates;
  if(event_id === -1) extra = '';

  await fetch(candidateAPI+extra, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      candidates = data;
    })
  );

  return candidates;
}

// get API for showing candidates
export async function get_candidates_party(party_id) {
  var extra = '?party_id='+party_id;
  var candidates;

  await fetch(candidateAPI+extra, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      candidates = data;
    })
  );

  return candidates;
}

// get API for showing events
export async function get_event(id) {
  var eventInfo;

  await fetch(votingEventsAPI+"/"+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      eventInfo = data;
    })
  );

  return eventInfo;
}

// get API for showing events
export async function get_events() {
  var events;
  var extra = '';

  await fetch(votingEventsAPI+extra, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      events = data;
    })
  );

  return events;
}

// get API for showing events
export async function get_events_open() {
  var events;

  await fetch(getNotVotedAPI, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      events = data;
    })
  );

  return events;
}

// get API for showing a specific candidate as well as the voting event and party information;
export async function get_party_all(id) {
  var party;
  var votingEvent;

  await fetch(partyAPI+'/'+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(responseParty =>
    responseParty.json().then(dataParty => {
      party = dataParty;
      return fetch('/voting-events/'+dataParty.v_event_id, {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      votingEvent = data;
    })
  );

  return {party: party, votingEvent: votingEvent};
}

// get API for showing parties
export async function get_party(id) {
  var party;

  await fetch(partyAPI+'/'+id, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      party = data;
    })
  );

  return party;
}

// get API for showing parties
export async function get_parties(event_id = -1) {
  var extra = '?v_event_id='+event_id;
  var parties;
  if(event_id === -1) extra = '';

  await fetch(partyAPI+extra, {
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  }).then(response =>
    response.json().then(data => {
      parties = data;
    })
  );

  return parties;
}

// post API for creating Candidate
export async function create_party(newParty) {
  return await fetch(createPartyAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(newParty)
  });
}

// delete API for deleting candidate
export async function delete_candidate(id) {
  return await fetch(candidateAPI+"/"+id+"/delete", {
    method: "DELETE",
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  });
}

// delete API for deleting party
export async function delete_party(id) {
  return await fetch(partyAPI+"/"+id+"/delete", {
    method: "DELETE",
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  });
}

// post API for creating Candidate
export async function create_event(newEvent) {
  return await fetch(createVoteEventAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
    body: JSON.stringify(newEvent)
  });
}

// delete API for deleting party
export async function delete_event(id) {
  return await fetch(votingEventsAPI+"/"+id+"/delete", {
    method: "DELETE",
    headers: {
      "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
    },
  });
}
