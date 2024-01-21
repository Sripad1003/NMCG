from flask import Flask,render_template,redirect,url_for,flash,jsonify,request
import sk 

# global user_message
# import sqlalchemy
app=Flask(__name__)
# app.secret_key="Sohith-NMCG"
# app.permanent_session_lifetime=timedelta(days=15)
# visitor_count=0
@app.route('/',methods=['GET'])
def m():
    return render_template('index.html')
@app.route('/home',methods=['POST','GET'])
def home():
    # global visitor_count
    # visitor_count += 1 
    return render_template('login.html')
# @app.route("/login", methods = ['POST','GET'])
# def login():

app = Flask(__name__)

@app.route('/')
@app.route('/home',methods=['POST','GET'])
def index():
    return render_template("index.html")
@app.route('/chatbot',methods=['POST','GET'])
def chatbot():
    return render_template("chatbot.html")
@app.route('/webhook', methods=['POST'])
def webhook():

    x = request.get_json()
    user_message = x['message']
    # def um(x = "user_message"):
    #     return x
    
    output = sk.response(user_message)
    return jsonify({'response': output})

if __name__ == "__main__":
    app.run(debug=True, port=3000) 