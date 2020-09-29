import os
# add more blue prints here. "project" is the directory, "test_page" is the file name, "simple_page" is the blueprint object.

from flask import Flask
from . import test_page
from . import auth


# this file is the main dirver for flask.
def create_app(test_config=None):
        
    # create the application
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    app.config["DEBUG"] = True
    app.register_blueprint(test_page.simple_page)
    app.register_blueprint(auth.bp)

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