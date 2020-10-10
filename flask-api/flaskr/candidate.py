from flask import Blueprint, abort, jsonify, request, make_response
from flaskr.db import get_db
from flask_jwt_extended import jwt_required
import json

bp = Blueprint('candidates', __name__, url_prefix='/candidates')

@bp.route('/create', methods=['POST'])
@jwt_required
def create():
    if not(request.data):
        abort(400, 'Bad Request')

    try:
        candidate_name = request.json['candidate_name']
        v_event_id = request.json['v_event_id']
    except:
        abort(400, 'Bad Request')

    try:
        party_id = request.json['party_id']
    except:
        party_id = None

    db = get_db()

    # Check if the Party exists
    if (party_id != None):
        party = db.execute(
            'SELECT * FROM party WHERE id = ?', (party_id,)
        ).fetchone()

        if party is None:
            abort(400, 'Bad Request')

    # Check if the Voting Event exists
    v_event = db.execute(
        'SELECT * FROM voting_event WHERE id = ?', (v_event_id,)
    ).fetchone()

    if v_event is None:
        abort(400, 'Bad Request')

    # Save to DB
    db.execute(
        'INSERT INTO candidate (candidate_name, party_id, v_event_id) VALUES (?, ?, ?)',
        (candidate_name, party_id, v_event_id)
    )
    db.commit()

    return '', 204

@bp.route('/<candidate_id>', methods=['GET'])
@jwt_required
def get(candidate_id):
    db = get_db()
    cursor = db.cursor()
    candidate = cursor.execute(
        'SELECT * FROM candidate WHERE id = ?', (candidate_id,)
    ).fetchone()

    if candidate is None:
        abort(404, 'Not Found')

    # Serialise response into a JSON object
    data = {}
    for key in candidate.keys():
        data[key] = candidate[key]

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('', methods=['GET'])
@jwt_required
def getList():
    candidate_name = request.args.get('candidate_name', None)
    party_id = request.args.get('party_id', None)
    v_event_id = request.args.get('v_event_id', None)

    db = get_db()
    cursor = db.cursor()

    if (candidate_name == None and party_id == None and v_event_id == None):
        print("1")
        candidates = cursor.execute(
            'SELECT * FROM candidate'
        ).fetchall()
    elif (candidate_name != None and party_id != None and v_event_id != None):
        print("2")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE candidate_name = ? AND party_id = ? AND v_event_id = ?',
            (candidate_name, party_id, v_event_id)
        ).fetchall()
    elif (candidate_name != None and party_id != None and v_event_id == None):
        print("3")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE candidate_name = ? AND party_id = ?',
            (candidate_name, party_id)
        ).fetchall()
    elif (candidate_name != None and party_id == None and v_event_id != None):
        print("4")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE candidate_name = ? AND v_event_id = ?',
            (candidate_name, v_event_id)
        ).fetchall()
    elif (candidate_name == None and party_id != None and v_event_id != None):
        print("5")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE party_id = ? AND v_event_id = ?',
            (party_id, v_event_id)
        ).fetchall()
    elif (candidate_name != None):
        print("6")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE candidate_name = ?',
            (candidate_name,)
        ).fetchall()
    elif (party_id != None):
        print("7")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE party_id = ?',
            (party_id,)
        ).fetchall()
    elif (v_event_id != None):
        print("8")
        candidates = cursor.execute(
            'SELECT * FROM candidate WHERE v_event_id = ?',
            (v_event_id,)
        ).fetchall()

    # Serialise response into a JSON object
    data = []
    for candidate in candidates:
        temp = {}
        for key in candidate.keys():
            temp[key] = candidate[key]
        data.append(temp)

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/<int:candidate_id>/update', methods=['PUT'])
@jwt_required
def update(candidate_id):
    if not(request.data):
        abort(400, 'Bad Request')

    try:
        candidate_name = request.json['candidate_name']
        v_event_id = request.json['v_event_id']
    except:
        abort(400, 'Bad Request')

    try:
        party_id = request.json['party_id']
    except:
        party_id = None

    db = get_db()

    # Check if the Party exists
    if (party_id != None):
        party = db.execute(
            'SELECT * FROM party WHERE id = ?', (party_id,)
        ).fetchone()

        if party is None:
            abort(400, 'Bad Request')

    # Check if the Voting Event exists
    v_event = db.execute(
        'SELECT * FROM voting_event WHERE id = ?', (v_event_id,)
    ).fetchone()

    if v_event is None:
        abort(400, 'Bad Request')

    # Update DB
    db.execute(
        'UPDATE candidate SET candidate_name = ?, party_id = ?, v_event_id = ? WHERE id = ?',
        (candidate_name, party_id, v_event_id, candidate_id)
    )
    db.commit()

    return '', 204

@bp.route('/<int:candidate_id>/delete', methods=['DELETE'])
@jwt_required
def delete(candidate_id):
    db = get_db()

    # Save to DB
    db.execute(
        'DELETE FROM candidate WHERE id = ?', (candidate_id,)
    )

    db.commit()

    return '', 204
