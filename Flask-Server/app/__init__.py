import os
from flask import Flask
from flask_cors import CORS

"""
config = {
    "DEBUG": os.getenv('DEBUG', 'development'),
    "HOST": os.getenv('HOST'),
    "PORT": int(os.getenv('PORT', '5001'))
}
"""
config = {
    "DEBUG": 'development',
    "PORT": 5001
}

def create_app():
    """Construct the core application."""
    app = Flask(__name__)
    app.config.from_mapping(config)
    cors = CORS(app, resources={r"/socket/*": {"origins": "https://manual.learnflow.io"}})
    with app.app_context():
        from . import routes  # Import routes
        return app