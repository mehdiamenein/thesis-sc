# Import base packages
from flask import current_app as app
# Import blueprints
from .sending_layer import send
from .result_layer import recieve
# Append blueprints
app.register_blueprint(send)
app.register_blueprint(recieve)