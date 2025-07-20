# app_local.py- se conecta de forma local
#from flask import Flask, render_template, jsonify, Response
# app_local.py
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, Response
import time

app = Flask(__name__)
app.secret_key = "robotpollito_2025"  # Clave secreta para manejo de sesión

# Usuario y contraseña simples (puedes cambiarlo)
USUARIO = "admin"
CLAVE = "robot123"

# Ruta de bienvenida y login
@app.route('/', methods=['GET', 'POST'])
def welcome():
    # Si ya está logueado, redirige al panel
    if 'usuario' in session:
        return redirect(url_for('panel'))
    error = None
    # Si se envía el formulario
    if request.method == 'POST':
        usuario = request.form['usuario']
        clave = request.form['password']
        # Verifica usuario/clave
        if usuario == USUARIO and clave == CLAVE:
            session['usuario'] = usuario  # Guarda en sesión
            return redirect(url_for('panel'))
        else:
            error = "Usuario o contraseña incorrectos"
    # Renderiza la página de bienvenida/login
    return render_template('welcome.html', error=error)

# Panel principal, solo accesible si hiciste login
@app.route('/panel')
def panel():
    if 'usuario' not in session:
        return redirect(url_for('welcome'))
    return render_template('index.html')

# Endpoint para cerrar sesión
@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('welcome'))

# Aquí mantienes tus rutas ya existentes (parámetros de prueba, video simulado, etc.)
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


