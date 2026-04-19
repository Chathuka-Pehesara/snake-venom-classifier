\"\"\"
Model Export Utility for Snake Classification
This script defines the architectures used in the project and provides 
instructions for finalizing the production model.
\"\"\"

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def create_deep_cnn_model(input_shape=(224, 224, 3)):
    \"\"\"
    Architecture of 'Deep_CNN_basic_fast' - The baseline custom vision model.
    \"\"\"
    model = keras.Sequential([
        layers.Input(shape=input_shape),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(512, activation='relu', kernel_regularizer=keras.regularizers.l2(0.01)),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu', kernel_regularizer=keras.regularizers.l2(0.01)),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ], name="Deep_CNN_v1")
    return model

def create_transfer_learning_model(input_shape=(224, 224, 3)):
    \"\"\"
    Recommended Upgrade: MobileNetV2 Transfer Learning for >90% accuracy.
    \"\"\"
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape, include_top=False, weights='imagenet'
    )
    base_model.trainable = False
    
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')
    ], name="Snake_Mobilenet_v2")
    return model

if __name__ == \"__main__\":
    print(\"🛠️ Snake Classification Model Exporter\")
    print(\"------------------------------------\")
    
    # Example for baseline model
    model = create_deep_cnn_model()
    print(\"✓ Custom Deep CNN Architecture initialized.\")
    
    print(\"\\n🚀 NEXT STEPS FOR FIXING PREDICTIONS:\")
    print(\"1. Open your notebook in Google Colab.\")
    print(\"2. Run: model.save('final_snake_model.keras')\")
    print(\"3. Download the file and place it in 'backend/models/'\")
    print(\"4. RESTART the backend server.\")
    
    print(\"\\n💡 TIP: If accuracy is still low, use the Transfer Learning architecture provided in this file.\")
