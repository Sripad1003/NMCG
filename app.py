from flask import Flask,render_template,redirect,url_for,flash,jsonify,request
import sk 
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
    user_message = user_message.replace("?", "")
    output = sk.response(user_message)
    return jsonify({'response': output})


if __name__ == '__main__':
    app.run(debug=True)
