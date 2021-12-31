# Import base packages
from flask import Blueprint, request, Response
import requests
import os
# ------------------------------
# Blueprint initiation
recieve = Blueprint('recieve', __name__, url_prefix="/result")
# ------------------------------
# Routes
@recieve.route('get/result', methods=['POST'])
def get_result():
    # Do whatever with the data
    return request.json
