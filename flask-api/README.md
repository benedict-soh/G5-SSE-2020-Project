# Flask Application

Please use python3 and pip3 for this flask application.

First, setup a venv. The `.gitignore` file already ignores the generated diretory, so you dont have to worry about anything. (You be prompted to install venv)

`python3.6 -m venv env`

Then run the command:

`source env/bin/activate`

Then install all required dependencies:

`pip3 install -r requirements.txt`

Once everything is installed, run `. ./setup.sh`. (Note: call setup.sh again if you ever clear your environmental vars, such as restarting your pc).

## After config
After running the "setup.sh", you can:

* Use `flask init-db` to run the schema.sql file. (Do this once, unless you changed the schema)
* Use `flask run` to start the flask app.

Note: the db is SQLite

All setup/config are based on the official flask documentation, see more here: https://flask.palletsprojects.com/en/1.1.x/tutorial/layout/

Fun DB related reading material (injection free): https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/
