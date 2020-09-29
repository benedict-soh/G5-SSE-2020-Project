import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, abort
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=('POST',))
def register():
    try:
        username = request.json['username']
        password = request.json['password']
        full_name = request.json['full_name']
        user_type = request.json['user_type']
    except:
        abort(400, "bad inputs")

    db = get_db()

    # check for duplicate username 
    if db.execute(
        'SELECT user_id FROM user_cred WHERE username = ?', (username,)
    ).fetchone() is not None:
        abort(400, 'User {} is already registered.'.format(username))

    
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
    return("good shit")
