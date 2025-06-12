# from datetime import timedelta
# import requests
import nltk
import numpy as np
import random
import string
import sklearn
import datetime, re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# import pathlib
# import textwrap
import google.generativeai as genai
from pymongo import MongoClient

nltk.download('punkt')
nltk.download('wordnet')

GREETING_INPUTS = ('hello', 'hi', 'greetings', 'sup', 'what\'s up', 'hey')
SENDOFF_INPUTS = ('bye','thankyou','see you later','time to go','okay then bye')
TIME_INPUTS = ("whats' the time", "time", " what time is it?", "what is the time?", "could you tell me the time please?", "do you have the time?")
DATE_INPUTS = ("what date is it today?", "date", "what's the date?", "do you know the date?", "what date are we on today?", "what's the date today?", "what's today's date?")
GREETING_RESPONSES = ['hi', 'hey', 'hi there', 'hello', 'I am glad! You are talking to me','Hi! Its great to see you again.', 'Good [morning/afternoon/evening]! I hope your day is going well.','Greetings! I hope everything is going smoothly for you.']
SENDOFF_RESPONSES = ['Take care and stay in touch!','Until we meet again, take care of yourself.','Goodbye for now, but not forever.','Farewell, but not goodbye. See you soon!']
BOTS = ('who are you?', 'who are you', 'tell me about yourself?', 'tell me about yourself')
BOTS_RESPONSES = "I am MASCOT, a virtual assistant created by TEAM_NMCG. I'm here to help answer your questions, provide information."
# client = MongoClient("mongodb+srv://chiliverysripad:Sripad1003@cluster0.hmzrnnp.mongodb.net/")
# db = client["textdb"]
# collection = db.nmcg


uri = "mongodb://kaushik321:767187@ac-ka03deq-shard-00-00.cbz6m0k.mongodb.net:27017,ac-ka03deq-shard-00-01.cbz6m0k.mongodb.net:27017,ac-ka03deq-shard-00-02.cbz6m0k.mongodb.net:27017/?ssl=true&replicaSet=atlas-7ynvsq-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)
db = client["Nmcg"]
collection = db.Chatbot

lemmer = nltk.stem.WordNetLemmatizer()
remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)

GOOGLE_API_KEY="AIzaSyCS_57bvmSnRKCu_GUeIsNINQuOh38N2Z8"
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-pro')
def lem_tokens(tokens):
    return [lemmer.lemmatize(token) for token in tokens]

def lem_normalize(text):
    return lem_tokens(nltk.word_tokenize(text.lower().translate(remove_punct_dict)))

def time(sentence):
    if sentence.lower() in TIME_INPUTS:
        return True
    return False

def date(sentence):
    if sentence.lower() in DATE_INPUTS:
        return True
    return False

def sendoff(sentence):
    for word in sentence.split():
        if word.lower() in SENDOFF_INPUTS:
            return random.choice(SENDOFF_RESPONSES)

def greeting(sentence):
    for word in sentence.split():
        if word.lower() in GREETING_INPUTS:
            return random.choice(GREETING_RESPONSES)
        
def bot_info(sentence):
        if sentence in BOTS:
            return True
        return False

def response(user_response):

    res1 = greeting(user_response)
    if (res1):
        return  res1
    
    res2 = time(user_response)
    if (res2):
        date_time=datetime.datetime.now()
        date_time=str(date_time)
        time1=re.findall(r'\d\d:\d\d:\d\d',date_time)
        return time1[0]

    #What is the main objective of nmcg, 
    res3 = date(user_response)

    if(res3):
        date_time=datetime.datetime.now()
        date_time=str(date_time)
        date1=re.findall(r'\d\d\d\d-\d\d-\d\d',date_time)
        return date1[0]

    res4 = sendoff(user_response)
    if (res4):
        return res4

    res5 = bot_info(user_response)
    if (res5):
        return BOTS_RESPONSES
    
    
    # print([sentence_tokens[:2], word_tokens[:2]])
    my_object = collection.find_one()["raw"]
    x = my_object
    robo_response = ''

    word_tokens = nltk.word_tokenize(x)
    sentence_tokens = nltk.sent_tokenize(x)
    sentence_tokens.append(user_response)
    vectorizer = TfidfVectorizer(tokenizer=lem_normalize, stop_words='english')
    tfidf = vectorizer.fit_transform(sentence_tokens)
    values = cosine_similarity(tfidf[-1], tfidf)

    # print(values)
    idx = values.argsort()[0][-2]
    # print(idx)
    flat = values.flatten()
    # print(flat)
    flat.sort()
    # print(flat)
    req_tfidf = flat[-2]
    print("TF-IDF: ", req_tfidf)

    if req_tfidf < 0.05:
        inp = user_response
        response_parapharase = model.generate_content(f"""Cosider you as a chatbot for an organization. Give the answer to {inp} in the form of text in less than 20 words.""")
        return response_parapharase.text
        # return '{} Sorry, I don\'t understand you'.format(robo_response)
    elif req_tfidf > 0.175:
        data = sentence_tokens[idx].split(";;", 1)
        robo_response += data[1] if len(data) > 1 else sentence_tokens[idx]
        print(robo_response)
        return robo_response[1:] if robo_response[0] == ' ' else robo_response
    else:
        inp = user_response
        response_parapharase = model.generate_content(f"""give the answer {inp} in the form of text in less than 50 words.""")
        user_response = user_response.replace("?", "")
        # print(user_response)
        y = x + "\n" + user_response + ";; " + response_parapharase.text[:-1].replace(".",",")+". "
        collection.find_one_and_replace({'raw': x}, {'raw': y})
        return "Sorry, I couldn't find results for that. Here are some results from Online:\n" + response_parapharase.text