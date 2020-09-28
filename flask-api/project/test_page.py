from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

# this is a test page, showcasing how to add new endpoints.
simple_page = Blueprint('simple_page', __name__,
                        template_folder='templates')

@simple_page.route('/pepe/', defaults={'page': 'index'})
@simple_page.route('/pepe/<page>')
def show(page):
    try:
        print("send help")
        return render_template('pages/%s.html' % page)
    except TemplateNotFound:
        abort(404)