import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# --- CONFIGURATION ---
DATA_DIR = "../Data/Raw data"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
MODEL_SAVE_PATH = "models/upgraded_snake_model.keras"

def train_high_accuracy():
    print("🚀 Initializing High-Accuracy Pipeline (Transfer Learning)...")
    
    # 📸 Optimized Data Generators with MobileNet Preprocessing
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    val_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        validation_split=0.2
    )
    
    train_gen = train_datagen.flow_from_directory(
        DATA_DIR, 
        target_size=IMG_SIZE, 
        batch_size=BATCH_SIZE, 
        class_mode='binary', 
        subset='training',
        shuffle=True
    )
    
    val_gen = val_datagen.flow_from_directory(
        DATA_DIR, 
        target_size=IMG_SIZE, 
        batch_size=BATCH_SIZE, 
        class_mode='binary', 
        subset='validation'
    )

    # 🛠️ Build Model using MobileNetV2
    print("🏗️ Loading base model...")
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), include_top=False, weights='imagenet'
    )
    base_model.trainable = False 

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.4),
        layers.Dense(1, activation='sigmoid')
    ])

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),
        loss='binary_crossentropy', 
        metrics=['accuracy', keras.metrics.Precision(name='precision'), keras.metrics.Recall(name='recall')]
    )

    if not os.path.exists("models"):
        os.makedirs("models")

    callbacks = [
        keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6),
        keras.callbacks.ModelCheckpoint(
            MODEL_SAVE_PATH, 
            monitor='val_accuracy', 
            save_best_only=True,
            verbose=1
        )
    ]

    print(f"⌛ Training for {EPOCHS} epochs...")
    try:
        model.fit(
            train_gen, 
            validation_data=val_gen, 
            epochs=EPOCHS, 
            callbacks=callbacks
        )
        print(f"✅ Success! High-performance model saved to {MODEL_SAVE_PATH}")
    except Exception as e:
        print(f"❌ Training Interrupted: {e}")
        model.save("models/emergency_backup_model.keras")

if __name__ == "__main__":
    train_high_accuracy()
