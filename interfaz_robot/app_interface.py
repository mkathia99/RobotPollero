# app_interface.py---------Es el servidor Flask que conecta la laptop con la Raspberry Pi
from flask import Flask, render_template, request, jsonify, Response
import requests

app = Flask(__name__)

RASPBERRY_URL = "http://192.168.137.130:8000"  # <- IP de Raspberry

@app.route('/')
def index():
    return render_template('index.html')   #interfaz principal

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
    #reenvía el streaming MJPEG desde la pi
    resp = requests.get(f"{RASPBERRY_URL}/video", stream=True)
    return Response(resp.iter_content(chunk_size=1024),
                    content_type=resp.headers['Content-Type'])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
