from flask import Blueprint, abort, jsonify, request, make_response
from flaskr.db import get_db
from flask_jwt_extended import jwt_required, get_jwt_claims
from datetime import datetime
import json

bp = Blueprint('voting_events', __name__, url_prefix='/voting-events')

@bp.route('/create', methods=['POST'])
@jwt_required
def create():
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'commissioner':
        abort(403, 'Forbidden')

    if not(request.data):
        abort(400, 'Bad Request')

    try:
        event_name = request.json['event_name']
        year = request.json['year']
        vote_start = datetime.strptime(request.json['vote_start'], '%Y-%m-%d')
        vote_end = datetime.strptime(request.json['vote_end'], '%Y-%m-%d')
    except:
        abort(400, 'Bad Request')

    db = get_db()
    cursor = db.cursor()

    # Save to DB
    cursor.execute(
        'INSERT INTO voting_event (event_name, year, vote_start, vote_end) VALUES (?, ?, ?, ?)',
        (event_name, year, vote_start, vote_end)
    )
    db.commit()

    resp = make_response({"id": cursor.lastrowid}, 201)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/<int:voting_event_id>', methods=['GET'])
@jwt_required
def get(voting_event_id):
    db = get_db()
    cursor = db.cursor()
    v_event = cursor.execute(
        'SELECT * FROM voting_event WHERE id = ?', (voting_event_id,)
    ).fetchone()

    if v_event is None:
        abort(404, 'Not Found')

    # Serialise response into a JSON object
    data = {}
    for key in v_event.keys():
        data[key] = v_event[key]

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('', methods=['GET'])
@jwt_required
def getList():
    db = get_db()
    cursor = db.cursor()
    v_events = cursor.execute(
        'SELECT * FROM voting_event'
    ).fetchall()

    if v_events is None:
        abort(404, 'Not Found')

    # Serialise response into a JSON object
    data = []
    for event in v_events:
        temp = {}
        for key in event.keys():
            temp[key] = event[key]
        data.append(temp)

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/open', methods=['GET'])
@jwt_required
def getListByUserId():
    # Check Authorisation
    token = get_jwt_claims()
    user_id = token['id']
    if token['user_type'] != 'voter':
        abort(403, 'Forbidden')

    print(user_id)

    db = get_db()
    cursor = db.cursor()
    v_events = cursor.execute(
        'SELECT * FROM voting_event'
    ).fetchall()
    event_id_list = list(map(lambda v_event: v_event['id'], v_events))

    status_list = cursor.execute(
        'SELECT * FROM vote_status WHERE user_id = ?', (user_id,)
    ).fetchall()
    voted_event_id_list = list(map(lambda v_status: v_status['v_event_id'], status_list))

    open_events = list(set(event_id_list).symmetric_difference(set(voted_event_id_list)))

    resp = make_response({"v_event_id_list": open_events}, 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/<int:voting_event_id>/tally', methods=['GET'])
@jwt_required
def tally(voting_event_id):
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'commissioner':
        abort(403, 'Forbidden')

    db = get_db()
    cursor = db.cursor()
    votes = cursor.execute(
        'SELECT * FROM vote_data WHERE v_event_id = ?', (voting_event_id,)
    ).fetchall()

    # Check if there are votes
    if len(votes) == 0:
        abort(404, 'Not Found')

    # Grab parties and candidates
    parties = cursor.execute(
        'SELECT * FROM party WHERE v_event_id = ?',
        (voting_event_id,)
    ).fetchall()
    party_id_list = list(map(lambda party: party['id'], parties))

    candidates = cursor.execute(
        'SELECT * FROM candidate WHERE v_event_id = ?',
        (voting_event_id,)
    ).fetchall()
    candidates_id_list = list(map(lambda candidate: candidate['id'], candidates))

    # Serialise data into a list of JSON object
    vote_data = list(map(lambda vote: json.loads(vote['vote_data_blob']), votes))

    # Construct voting objects
    above_votes = []
    for party in parties:
        temp = []
        for num in range(1, len(parties) + 1):
            obj = {}
            obj[num] = 0
            temp.append(obj)

        above_votes.append({"party_id": party['id'], "votes": temp})

    below_votes = []
    for candidate in candidates:
        temp = []
        for num in range(1, len(candidates) + 1):
            obj = {}
            obj[num] = 0
            temp.append(obj)

        below_votes.append({"candidate_id": candidate['id'], "votes": temp})

    # Count votes
    total_above = 0
    total_below = 0
    total = 0

    for vote in vote_data:
        total += 1
        atl_vote = vote['above']
        btl_vote = vote['below']

        if len(atl_vote) >= 6:
            total_above += 1
            for mark in atl_vote:
                for above in above_votes:
                    if above["party_id"] == mark["party_id"]:
                        for count in above["votes"]:
                            if mark["number"] in count:
                                count[mark["number"]] += 1
        elif len(btl_vote) >= 12:
            total_below += 1
            for mark in btl_vote:
                for below in below_votes:
                    if below["candidate_id"] == mark["candidate_id"]:
                        for count in below["votes"]:
                            if mark["number"] in count:
                                count[mark["number"]] += 1

    data = {"above": above_votes, "below": below_votes, "total_above": total_above, "total_below": total_below,"total": total}
    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/<int:voting_event_id>/update', methods=['PUT'])
@jwt_required
def update(voting_event_id):
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'commissioner':
        abort(403, 'Forbidden')

    if not(request.data):
        abort(400, 'Bad Request')

    try:
        event_name = request.json['event_name']
        year = request.json['year']
        vote_start = datetime.strptime(request.json['vote_start'], '%Y-%m-%d')
        vote_end = datetime.strptime(request.json['vote_end'], '%Y-%m-%d')
    except:
        abort(400, 'Bad Request')

    db = get_db()
    cursor = db.cursor()

    # Check if object exists in DB
    v_event = cursor.execute(
        'SELECT * FROM voting_event WHERE id = ?', (voting_event_id,)
    ).fetchone()

    if v_event is None:
        abort(404, 'Not Found')

    # Update DB
    cursor.execute(
        'UPDATE voting_event SET event_name = ?, year = ?, vote_start = ?, vote_end = ? WHERE id = ?',
        (event_name, year, vote_start, vote_end, voting_event_id)
    )
    db.commit()

    return '', 204

@bp.route('/<int:voting_event_id>/delete', methods=['DELETE'])
@jwt_required
def delete(voting_event_id):
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'commissioner':
        abort(403, 'Forbidden')

    db = get_db()
    cursor = db.cursor()

    # Save to DB
    cursor.execute(
        'DELETE FROM voting_event WHERE id = ?', (voting_event_id,)
    )

    db.commit()

    return '', 204
