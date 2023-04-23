from flask import Flask, request
from flask_cors import CORS
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import openai

openai.api_key = 'OPENAI API KEY'

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=['POST'])
def upload_file():
    print("POST: /upload")
    file = request.files['file']
    file.save(file.filename)
    
    print(file.filename.split('.')[-1])

    if file.filename.split('.')[-1] in ['jpg', 'jpeg', 'png']:
        img = Image.open(file.filename)

    else:
        pages = convert_from_path(file.filename)
        for page in pages:
            page.save('out.jpg', 'JPEG')
        img = Image.open('out.jpg')

    text = pytesseract.image_to_string(img)

    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant, and help with reviewing resumes"},
            {"role": "user", "content": f"I will you give you resume text, you will give me 1) spelling mistakes 2) improvements that can be made (atleast 4 points) 3) A review 4) A single digit representing rating out of 10 5)Note to the candidate, and respond in markdown format with the headings as ## and do not inclue the actual resume text in the response\n\n{text}"}
            ]
        )

    print('openai called')

    return {"response": str(response['choices'][0]['message']['content'])}
    
if __name__ == "__main__":
    app.run()
