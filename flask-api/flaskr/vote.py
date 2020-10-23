from flask import Blueprint, abort, jsonify, request, make_response
from flaskr.db import get_db
from flask_jwt_extended import jwt_required, get_jwt_claims
from datetime import datetime
import json

bp = Blueprint('votes', __name__, url_prefix='/votes')

@bp.route('/create', methods=['POST'])
@jwt_required
def create():
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'voter':
        abort(403, 'Forbidden')

    if not(request.data):
        abort(400, 'Bad Request')

    try:
        vote_data = request.json['vote_data']
        v_event_id = request.json['v_event_id']
    except:
        abort(400, 'Bad Request')

    # Get User ID
    token = get_jwt_claims()
    user_id = token['id']

    db = get_db()
    cursor = db.cursor()

    # Validate v_event_id
    v_event = cursor.execute(
        'SELECT * FROM voting_event WHERE id = ?',
        (v_event_id,)
    ).fetchone()

    if v_event is None:
        abort(400, 'Bad Request')

    # Check if currently time is within designated voting time period
    current_time = datetime.now()

    if current_time < v_event['vote_start'] or current_time > v_event['vote_end']:
        print("bad time")
        abort(400, 'Bad Request')

    # Check if user has voted
    v_status = cursor.execute(
        'SELECT * FROM vote_status WHERE v_event_id = ? AND user_id = ?',
        (v_event_id, user_id)
    ).fetchone()

    if not v_status is None:
        abort(400, 'Bad Request')

    # Validate vote data
    parties = cursor.execute(
        'SELECT * FROM party WHERE v_event_id = ?',
        (v_event_id,)
    ).fetchall()
    party_id_list = list(map(lambda party: party['id'], parties))

    candidates = cursor.execute(
        'SELECT * FROM candidate WHERE v_event_id = ?',
        (v_event_id,)
    ).fetchall()
    candidates_id_list = list(map(lambda candidate: candidate['id'], candidates))

    try:
        atl_vote = vote_data['above']
        btl_vote = vote_data['below']

        # Check votes
        if len(atl_vote) >= 6:
            # Validate above the line votes
            # Check if parties exist
            for party in atl_vote:
                if not party['party_id'] in party_id_list:
                    abort(400, 'Bad Request')

            # Check for no duplicate values
            length = len(atl_vote)
            vote_values = list(map(lambda vote: vote['number'], atl_vote))
            vote_values = list(dict.fromkeys(vote_values))
            if length != len(vote_values):
                abort(400, 'Bad Request')

            # Check if numbered correctly
            if set(vote_values) != set(range(1, length + 1)):
                abort(400, 'Bad Request')

        elif len(btl_vote) >= 12:
            # Validate below the line votes
            # Check if candidates exist
            for candidate in btl_vote:
                if not candidate['candidate_id'] in candidates_id_list:
                    abort(400, 'Bad Request')

            # Check if no duplicate values
            length = len(btl_vote)
            vote_values = list(map(lambda vote: vote['number'], btl_vote))
            vote_values = list(dict.fromkeys(vote_values))
            if length != len(vote_values):
                abort(400, 'Bad Request')

            # Check if numbered correctly
            if set(vote_values) != set(range(1, length + 1)):
                abort(400, 'Bad Request')

        else:
            # ATL or BTL vote hasn't been done
            abort(400, 'Bad Request')
    except:
        # Throw error by default
        abort(400, 'Bad Request')

    # Create vote_data
    cursor.execute('INSERT INTO vote_data (vote_data_blob, v_event_id) VALUES (?, ?)',
                  (json.dumps(vote_data), v_event_id)
    )

    # Create vote_status
    cursor.execute('INSERT INTO vote_status (user_id, v_event_id) VALUES (?, ?)',
                  (user_id, v_event_id)
    )

    db.commit()

    return '', 201

# THIS ENDPOINT IS TO CHECK IF CREATE WORKS, DELETE LATER
@bp.route('', methods=['GET'])
@jwt_required
def get():
    abort(403, 'Forbidden')

    db = get_db()
    cursor = db.cursor()
    votes = cursor.execute(
        'SELECT * FROM vote_data'
    ).fetchall()

    # Serialise response into a JSON object
    data = []
    for vote in votes:
        temp = {}
        for key in vote.keys():
            temp[key] = vote[key]
        data.append(temp)

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

# THIS ENDPOINT IS TO CHECK IF CREATE WORKS, DELETE LATER
@bp.route('/status', methods=['GET'])
@jwt_required
def getStatus():
    abort(403, 'Forbidden')

    db = get_db()
    cursor = db.cursor()
    status = cursor.execute(
        'SELECT * FROM vote_status'
    ).fetchall()

    # Serialise response into a JSON object
    data = []
    for vs in status:
        temp = {}
        for key in vs.keys():
            temp[key] = vs[key]
        data.append(temp)

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

# THIS ENDPOINT IS TO CHECK IF CREATE WORKS, DELETE LATER
@bp.route('/delete', methods=['DELETE'])
@jwt_required
def delete():
    abort(403, 'Forbidden')

    # Get User ID
    token = get_jwt_claims()
    user_id = token['id']

    db = get_db()

    # Save to DB
    db.execute(
        'DELETE FROM vote_status WHERE user_id = ?', (user_id,)
    )

    db.commit()

    return '', 204
