from flask import Blueprint, request, jsonify
from services.langchain_excel import excel_answer
import os

excel_chat = Blueprint('excel_chat', __name__)

@excel_chat.route('/api/chat/excel', methods=['POST'])
def excel_chat_route():
    if 'file' not in request.files or 'question' not in request.form:
        return jsonify({'error': 'File and question are required'}), 400
    file = request.files['file']
    question = request.form['question']
    file_path = os.path.join('/tmp', file.filename)
    file.save(file_path)
    try:
        response = excel_answer(file_path, question)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
