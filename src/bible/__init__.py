import os
from flask import Flask


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY="dev", DATABASE=os.path.join(app.instance_path, "bible.sqlite"))

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/status")
    def status():
        return "OK"

    from bible import db

    db.init_app(app)

    # TODO: Register blueprints
    #https://github.com/pallets/flask/blob/fdac8a5404e3e3a316568107a293f134707c75bb/examples/tutorial/flaskr/__init__.py#L41
    # from bible import thingie
    # app.register_blueprint(thingie.bp)

    app.add_url_rule("/", endpoint="index")
    return app
