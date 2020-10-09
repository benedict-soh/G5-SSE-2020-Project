# Flask Application

Please use python3 and pip3 for this flask application.

To run this application, first install all required dependencies:

`pip3 install -r requirements.txt`

You can also setup a venv if you want to have clean, project specific dependencies. If you are using venv, the `.gitignore` file already ignores the generated diretory, so you dont have to worry about anything. 

Once everything is installed, run `. ./setup.sh`. (Note: call setup.sh again if you ever clear your environmental vars, such as restarting your pc).

## After config
After running the "setup.sh", you can:

* Use `flask db-init` to run the schema.sql file. (Do this once, unless you changed the schema)
* Use `flask run` to start the flask app.

Note: the db is SQLite

All setup/config are based on the official flask documentation, see more here: https://flask.palletsprojects.com/en/1.1.x/tutorial/layout/

Fun DB related reading material (injection free): https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/
