import flask
# add more blue prints here. "project" is the directory, "test_page" is the file name, "simple_page" is the blueprint object.
from project.test_page import simple_page

# create the application
app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.register_blueprint(simple_page)

# app route defines the base methods. @ annotation is used to mark routes on functions
@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

# start the application
app.run()