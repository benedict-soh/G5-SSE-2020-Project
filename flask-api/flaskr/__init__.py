import os
from flask import Flask
from . import (
    test_page, auth, voting_event
)
from flask_jwt_extended import JWTManager



# this file is the main dirver for flask.
def create_app(test_config=None):

    # create the application
    app = Flask(__name__, instance_relative_config=True)

    # add more configs here
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    app.config["DEBUG"] = True
    app.config['JWT_SECRET_KEY'] =  os.environ['FLASK_SECRET_KEY']
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False


    # add more blue prints here. "test_page" is the file name, "simple_page" is the blueprint object.
    app.register_blueprint(test_page.simple_page)
    app.register_blueprint(auth.bp)
    app.register_blueprint(voting_event.bp)


    # setting up JWT manager
    jwt = JWTManager(app)


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
