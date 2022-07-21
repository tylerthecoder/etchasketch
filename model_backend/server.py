from flask import Flask, json, request, jsonify, flash, redirect
import os
from werkzeug.utils import secure_filename

print("Starting")

from drawing_classifier import drawing_classifier

print('imported classifier')

UPLOAD_FOLDER = './uploads'

# JSON formatted data
companies = [{"id": 1, "name": "Company One"}, {"id": 2, "name": "Company Two"}]

# declaring flask object
api = Flask(__name__)

api.secret_key = 'super secret key'
api.config['SESSION_TYPE'] = 'filesystem'

# connecting URL to verb. Decorator takes get_companies() as an argument so it knows to run
@api.route('/companies', methods=['GET'])
def get_companies():
    # converts dictionary to JSON format
  return json.dumps(companies)

@api.route('/companies', methods=['POST'])
def post_company():
  data = request.get_data()
  print("Request Data:", data)
  return 'test\n'

@api.route('/predict', methods=['POST'])
def get_image():
  print(request.files)
  data = request.get_data()
  if 'file' not in request.files:
      flash('No file part')
      return redirect(request.url)

  file = request.files['file']
  filename = secure_filename(file.filename)

  full_path = os.path.join(UPLOAD_FOLDER, filename)

  file.save(full_path)
  
  pred, certainty = drawing_classifier(full_path)
  
  return pred + "\n"

if __name__ == '__main__':
    api.run() 