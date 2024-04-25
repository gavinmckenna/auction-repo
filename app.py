from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://auction-site-mess.firebaseapp.com/"}})

@app.route('/api/data')
def data():
    return {"message": "Hello from Flask!"}
