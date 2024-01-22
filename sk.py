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

nltk.download('punkt')
nltk.download('wordnet')

GREETING_INPUTS = ('hello', 'hi', 'greetings', 'sup', 'what\'s up', 'hey',)
TIME_INPUTS = ("whats' the time", "time", " what time is it?", "what is the time?", "could you tell me the time please?", "do you have the time?")
DATE_INPUTS = ("what date is it today?", "date", "what's the date?", "do you know the date?", "what date are we on today?", "what's the date today?", "what's today's date?")
GREETING_RESPONSES = ['hi', 'hey', 'hi there', 'hello', 'I am glad! You are talking to me']

with open("text.txt", 'r',encoding='utf-8') as file:
    raw = file.read()

lemmer = nltk.stem.WordNetLemmatizer()
remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)

GOOGLE_API_KEY="AIzaSyDA4x_vwtDPTVH0V_gcKAQeViMLVjy-D70"
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

def greeting(sentence):
    for word in sentence.split():
        if word.lower() in GREETING_INPUTS:
            return random.choice(GREETING_RESPONSES)


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

    
    # print([sentence_tokens[:2], word_tokens[:2]])

    robo_response = ''
    word_tokens = nltk.word_tokenize(raw)
   
    sentence_tokens = nltk.sent_tokenize(raw)
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
    if req_tfidf == 0:
        return '{} Sorry, I don\'t understand you'.format(robo_response)
    elif req_tfidf >0.21:
        return  robo_response + sentence_tokens[idx]
    # .replace(user_response,"")
    else:
        inp = user_response
        response_parapharase = model.generate_content(f"""give me the paraphrase answer {inp} in the form of text in less than 50 words.""")
        new_string = user_response + ", " + response_parapharase.text[:-1].replace(".",",")+". "
        
        with open("text.txt", 'a',encoding='utf-8') as file:
            file.write(new_string.replace("*",""))

        # text.raw = text.raw + user_response + ", " + response_parapharase.text.replace(".",",")+". "
        return "We didn't understand that! Here are some results from Online:\n" + response_parapharase.text
print(response("how to reduce water pollution"))
