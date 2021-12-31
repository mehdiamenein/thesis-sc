# Import base packages
from flask import Blueprint, request, Response
import requests
import os
# ------------------------------
# Blueprint initiation
send = Blueprint('send', __name__, url_prefix="/socket")
# ------------------------------
# Routes
@send.route('<path:text>', methods=['GET', 'POST'])
def all_routes(text):
    resp = requests.request(
        method=request.method,
        url=request.url.replace(os.getenv('HOST') + "/socket", os.getenv('EXT_HOST')),
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    print(response)
    return response
