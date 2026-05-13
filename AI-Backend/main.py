from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = FastAPI(title="Snake Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
IMG_SIZE = (224, 224)
MODEL_PATH = "models/upgraded_snake_model.keras"

# --- SMART CALIBRATION ---
# Lower threshold (0.4) increases sensitivity to venomous patterns.
# Higher threshold (0.6) makes it "stricter" before calling something venomous.
THRESHOLD = 0.45 
UNCERTAINTY_ZONE = 0.15 # Scores between (THRESHOLD +/- 0.15) will be marked as uncertain

# Global variable to store the model
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
        except Exception as e:
            print(f"✗ Load Error: {e}")
    else:
        print(f"⚠ Model file not found.")

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        content = await file.read()
        if model is None: return {"error": "No model"}

        processed_img = preprocess_image(content)
        prediction_prob = float(model.predict(processed_img)[0][0])
        
        # 🧠 Smart Thresholding
        is_venomous = prediction_prob > THRESHOLD
        
        # Calculate uncertainty
        is_uncertain = abs(prediction_prob - THRESHOLD) < UNCERTAINTY_ZONE
        
        # Determine confidence
        if is_venomous:
            confidence = prediction_prob
        else:
            confidence = 1.0 - prediction_prob

        return {
            "prediction": "Venomous" if is_venomous else "Non-Venomous",
            "confidence": round(confidence, 4),
            "is_venomous": bool(is_venomous),
            "is_uncertain": is_uncertain,
            "raw_score": prediction_prob,
            "status": "warning" if is_venomous else "success",
            "message": "⚠️ Result is uncertain. Please rely on expert ID." if is_uncertain else "Classification complete."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
