# app_interface.py---------Es el servidor Flask que conecta la laptop con la Raspberry Pi
from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

RASPBERRY_URL = "http://192.168.137.61:8000"  # <- IP de Raspberry

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/control', methods=['POST'])
def control():
    data = request.json
    r = requests.post(f"{RASPBERRY_URL}/control", json=data)
    return jsonify(r.json())

@app.route('/estado')
def estado():
    r = requests.get(f"{RASPBERRY_URL}/estado")
    return jsonify(r.json())

@app.route('/video')
def video():
    return requests.get(f"{RASPBERRY_URL}/video", stream=True).raw

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
