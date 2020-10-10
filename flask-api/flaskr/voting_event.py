from flask import Blueprint, abort, jsonify, request, make_response
from flaskr.db import get_db
from flask_jwt_extended import jwt_required
from datetime import datetime
import json

bp = Blueprint('voting_events', __name__, url_prefix='/voting_events')

@bp.route('/create', methods=['POST'])
@jwt_required
def create():
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

    # Save to DB
    db.execute(
        'INSERT INTO voting_event (event_name, year, vote_start, vote_end) VALUES (?, ?, ?, ?)',
        (event_name, year, vote_start, vote_end)
    )
    db.commit()

    return '', 204

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

@bp.route('/<int:voting_event_id>/update', methods=['PUT'])
@jwt_required
def update(voting_event_id):
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
    db = get_db()

    # Save to DB
    db.execute(
        'DELETE FROM voting_event WHERE id = ?', (voting_event_id,)
    )

    db.commit()

    return '', 204
