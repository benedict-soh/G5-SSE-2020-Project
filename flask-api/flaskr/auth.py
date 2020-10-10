import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, abort, jsonify
)

from flask_jwt_extended import (
    jwt_required, create_access_token,
    get_jwt_identity, set_access_cookies, unset_jwt_cookies
)

from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=['POST'])
def register():
    try:
        username = request.json['username']
        password = request.json['password']
        full_name = request.json['full_name']
        user_type = request.json['user_type']
    except:
        abort(400, 'Bad Request')

    db = get_db()

    # check for duplicate username
    if db.execute(
        'SELECT user_id FROM user_cred WHERE username = ?', (username,)
    ).fetchone() is not None:
        abort(400, 'Bad Request')


    # transational, the commit pushes all executed db changes
    c = db.execute(
        'INSERT INTO user (full_name, user_type) VALUES (?, ?)',
        (full_name, user_type)
    )
    user_id = c.lastrowid
    db.execute(
        'INSERT INTO user_cred (user_id, username, password) VALUES (?, ?, ?)',
        (user_id, username, generate_password_hash(password))
    )
    db.commit()
    # return redirect(url_for('auth.login'))
    return "good shit"


@bp.route('/login', methods=['POST'])
def login():
    try:
        username = request.json['username']
        password = request.json['password']
    except:
        abort(400, 'Bad Request')

    db = get_db()

    user = db.execute(
        'SELECT * FROM user_cred WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        abort(400, 'The username or password was incorrect')
    elif not check_password_hash(user['password'], password):
        abort(400, 'The username or password was incorrect')

    # do JWT stuff here
    access_token = create_access_token(identity=username)
    resp = jsonify({'login': True})
    set_access_cookies(resp, access_token)
    return resp, 200


@bp.route('/logout', methods=['POST', 'GET'])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200


@bp.route('/test', methods=['POST', 'GET'])
@jwt_required
def test():
    return "cool"
