import os
from flask import Flask
from . import (
    test_page, auth, candidate, party, voting_event, vote
)
from flask_jwt_extended import JWTManager
from flask_cors import CORS



# this file is the main dirver for flask.
def create_app(test_config=None):

    # create the application
    app = Flask(__name__, instance_relative_config=True)

    # Allow all CORS requests, since this is an API only
    CORS(app)

    # add more configs here
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    app.config["DEBUG"] = True
    app.config['JWT_SECRET_KEY'] =  os.environ['FLASK_SECRET_KEY']
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']

    # these two should be set to true in the future.
    # The first adds CSRF (more work for testing), the second forces the cookies to be sent over https (which is currently not supported).
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_COOKIE_SECURE'] = False

    # add more blue prints here. "test_page" is the file name, "simple_page" is the blueprint object.
    app.register_blueprint(test_page.simple_page)
    app.register_blueprint(auth.bp)
    app.register_blueprint(voting_event.bp)
    app.register_blueprint(candidate.bp)
    app.register_blueprint(party.bp)
    app.register_blueprint(vote.bp)

    # setting up JWT manager
    jwt = JWTManager(app)

    # this is called when create_access_token(var) is called, and add these claims to the token.
    # this function can only have 1 var as input, and must return data that is json serializable.
    # data can be accessed with get_jwt_claims() on an @jwt_required endpoint.
    # see https://flask-jwt-extended.readthedocs.io/en/stable/add_custom_data_claims/ as example.
    @jwt.user_claims_loader
    def add_claims_to_access_token(user_id_and_type):
        return {
            'id': user_id_and_type[0],
            'user_type': user_id_and_type[1]
        }


    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass


    # app route defines the base methods. @ annotation is used to mark routes on functions
    @app.route('/', methods=['GET'])
    def home():
        return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"


    # start the DB module, enables `flask init-db`. See db.py for implementation
    from . import db
    db.init_app(app)


    # start the application
    return app
