import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import requests
import base64
import io
from PIL import Image
import uvicorn

app = FastAPI(title="Fruit Segmentation API - Roboflow Integration")

# Servir le dossier /static
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_homepage():
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="index.html non trouvé")

# Configuration Roboflow
ROBOFLOW_API_KEY = "BpYl6X44vRYGzbqu62Mz"
ROBOFLOW_MODEL = "fruis-segmentation"
ROBOFLOW_VERSION = "3"
ROBOFLOW_BASE_URL = f"https://outline.roboflow.com/{ROBOFLOW_MODEL}/{ROBOFLOW_VERSION}?api_key={ROBOFLOW_API_KEY}"

# Autoriser les requêtes depuis n’importe où
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fonction utilitaire
def resize_and_encode_image(image_bytes: bytes, max_size: int = 1500) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    width, height = image.size
    if width > height and width > max_size:
        height = int(height * max_size / width)
        width = max_size
    elif height > max_size:
        width = int(width * max_size / height)
        height = max_size
    image = image.resize((width, height))
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")

# Endpoint principal : /predict
@app.post("/predict")
async def predict(request: Request, file: UploadFile = File(None)):
    try:
        if file:
            image_bytes = await file.read()
            base64_image = resize_and_encode_image(image_bytes)
            response = requests.post(
                ROBOFLOW_BASE_URL,
                data=base64_image,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
        else:
            body = await request.json()
            if "image_url" not in body:
                raise HTTPException(status_code=400, detail="Champ 'image_url' manquant.")
            image_url = body["image_url"]
            response = requests.get(
                f"{ROBOFLOW_BASE_URL}&image={image_url}",
                headers={"Content-Type": "application/json"}
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Lancement sur Railway
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
