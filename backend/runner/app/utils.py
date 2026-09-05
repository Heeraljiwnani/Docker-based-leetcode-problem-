import os
import uuid

TEMP_FOLDER = "temp"

os.makedirs(TEMP_FOLDER, exist_ok=True)

def random_filename(extension):
    return f"{uuid.uuid4().hex}.{extension}"