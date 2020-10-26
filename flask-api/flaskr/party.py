from flask import Blueprint, abort, jsonify, request, make_response
from flaskr.db import get_db
from flask_jwt_extended import jwt_required, get_jwt_claims
import json

bp = Blueprint('parties', __name__, url_prefix='/parties')

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
        party_name = request.json['party_name']
        v_event_id = request.json['v_event_id']
    except:
        abort(400, 'Bad Request')

    db = get_db()
    cursor = db.cursor()

    # Check if the Voting Event exists
    v_event = cursor.execute(
        'SELECT * FROM voting_event WHERE id = ?', (v_event_id,)
    ).fetchone()

    if v_event is None:
        abort(400, 'Bad Request')

    # Save to DB
    cursor.execute(
        'INSERT INTO party (party_name, v_event_id) VALUES (?, ?)',
        (party_name, v_event_id)
    )
    db.commit()

    resp = make_response({"id": cursor.lastrowid}, 201)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/<party_id>', methods=['GET'])
@jwt_required
def get(party_id):
    db = get_db()
    cursor = db.cursor()
    party = cursor.execute(
        'SELECT * FROM party WHERE id = ?', (party_id,)
    ).fetchone()

    if party is None:
        abort(404, 'Not Found')

    # Serialise response into a JSON object
    data = {}
    for key in party.keys():
        data[key] = party[key]

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('', methods=['GET'])
@jwt_required
def getList():
    party_name = request.args.get('party_name', None)
    v_event_id = request.args.get('v_event_id', None)

    db = get_db()
    cursor = db.cursor()

    if (party_name == None and v_event_id == None):
        parties = cursor.execute(
            'SELECT * FROM party'
        ).fetchall()
    elif (party_name != None and v_event_id != None):
        parties = cursor.execute(
            'SELECT * FROM party WHERE party_name = ? AND v_event_id = ?',
            (party_name, v_event_id)
        ).fetchall()
    elif (party_name != None):
        parties = cursor.execute(
            'SELECT * FROM party WHERE party_name = ?',
            (party_name,)
        ).fetchall()
    elif (v_event_id != None):
        parties = cursor.execute(
            'SELECT * FROM party WHERE v_event_id = ?',
            (v_event_id,)
        ).fetchall()

    # Serialise response into a JSON object
    data = []
    for party in parties:
        temp = {}
        for key in party.keys():
            temp[key] = party[key]
        data.append(temp)

    resp = make_response(json.dumps(data, default=str), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp

@bp.route('/<int:party_id>/update', methods=['PUT'])
@jwt_required
def update(party_id):
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'commissioner':
        abort(403, 'Forbidden')

    if not(request.data):
        abort(400, 'Bad Request')

    try:
        party_name = request.json['party_name']
        v_event_id = request.json['v_event_id']
    except:
        abort(400, 'Bad Request')

    db = get_db()
    cursor = db.cursor()

    # Check if the Voting Event exists
    v_event = cursor.execute(
        'SELECT * FROM voting_event WHERE id = ?', (v_event_id,)
    ).fetchone()

    if v_event is None:
        abort(400, 'Bad Request')

    # Update DB
    cursor.execute(
        'UPDATE party SET party_name = ?, v_event_id = ? WHERE id = ?',
        (party_name, v_event_id, party_id)
    )
    db.commit()

    return '', 204

@bp.route('/<int:party_id>/delete', methods=['DELETE'])
@jwt_required
def delete(party_id):
    # Check Authorisation
    token = get_jwt_claims()
    if token['user_type'] != 'commissioner':
        abort(403, 'Forbidden')

    db = get_db()
    cursor = db.cursor()

    # Save to DB
    cursor.execute(
        'DELETE FROM party WHERE id = ?', (party_id,)
    )

    db.commit()

    return '', 204
