# app_local.py
from flask import Flask, render_template, jsonify, Response
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/estado')
def estado():
    return jsonify({
        "rpm": {"M1": 120, "M2": 115, "M3": 118, "M4": 110},
        "modo": "automático",
        "accion": "avanzando"
    })

@app.route('/video')
def video():
    def generar():
        with open("static/robot1.jpg", "rb") as f:
            imagen = f.read()
        while True:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + imagen + b'\r\n')
            time.sleep(1)
    return Response(generar(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5000)


