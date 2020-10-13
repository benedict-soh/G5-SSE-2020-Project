DROP TABLE IF EXISTS user;

DROP TABLE IF EXISTS user_cred;

DROP TABLE IF EXISTS voting_event;

DROP TABLE IF EXISTS vote_status;

DROP TABLE IF EXISTS vote_data;

DROP TABLE IF EXISTS party;

DROP TABLE IF EXISTS candidate;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL
);

CREATE TABLE user_cred (
    user_id INTEGER NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE voting_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    vote_start TIMESTAMP NOT NULL,
    vote_end TIMESTAMP NOT NULL
);

CREATE TABLE vote_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    v_event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(v_event_id) REFERENCES voting_event(id)
);

CREATE TABLE vote_data(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vote_data_blob TEXT NOT NULL,
    v_event_id INTEGER NOT NULL,
    FOREIGN KEY(v_event_id) REFERENCES voting_event(id)
);

CREATE TABLE party (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    party_name text NOT NULL,
    v_event_id INTEGER NOT NULL,
    FOREIGN KEY(v_event_id) REFERENCES voting_event(id)
);

CREATE TABLE candidate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_name text NOT NULL,
    party_id INTEGER,
    v_event_id INTEGER NOT NULL,
    candidate_order INTEGER,
    exclude BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(party_id) REFERENCES party(id),
    FOREIGN KEY(v_event_id) REFERENCES voting_event(id)
);
