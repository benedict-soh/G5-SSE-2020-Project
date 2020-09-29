# Flask Application

Please use python3 and pip3 for this flask application.

To run this application, first install all required dependencies:

`pip3 install -r requirements.txt`

You can also setup a venv if you want to have clean, project specific dependencies.

Once everything is installed, run `. ./setup.sh`. (Note: call setup.sh again if you ever clear your environmental vars, such as restarting your pc).

## Post config
After running the "setup.sh", you can:

* Use `flask db-init` to run the schema.sql file.
* Use `flask run` to start the flask app.

All setup/config are based on the official flask documentation, see more here: https://flask.palletsprojects.com/en/1.1.x/tutorial/layout/
Fun DB related reading material (injection free): https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/
