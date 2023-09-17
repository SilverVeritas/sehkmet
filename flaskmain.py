# app.py
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/2')
def step2():
    return render_template('step_2.html')

@app.route('/3')
def step3():
    return render_template('step_3.html')

@app.route('/4')
def step4():
    return render_template('step_4.html')

@app.route('/therapy')
def therapy():
    return render_template('therapy.html')

@app.route('/feedback')
def fb():
    return render_template('feedback.html')

@app.route('/ambient')
def main_page():
    return render_template('ambient.html')

if __name__ == "__main__":
    app.run(debug=True)
