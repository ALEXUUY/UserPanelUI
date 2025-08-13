from flask import Flask, send_from_directory, send_file
import os

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    try:
        # Try to serve the file from the root directory
        if os.path.exists(filename):
            return send_file(filename)
        # If it's a CSS or JS file, try from respective directories
        elif filename.startswith('css/'):
            return send_from_directory('.', filename)
        elif filename.startswith('js/'):
            return send_from_directory('.', filename)
        else:
            # For HTML files, serve directly
            return send_file(filename)
    except:
        return send_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)