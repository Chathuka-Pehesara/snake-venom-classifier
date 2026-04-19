# 🛡️ VenomGuard Pro: Advanced Biosafety AI

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Bridging the gap between wildlife herpetology and instant digital assessment using neural pattern recognition.**

VenomGuard Pro is a high-end application designed to classify snakes as venomous or non-venomous with millisecond precision. Developed to assist explorers, medical responders, and wildlife enthusiasts, the system utilizes a custom-tuned Convolutional Neural Network (CNN) to analyze scale architecture and head geometry.

---

## 🌟 Key Features

-   **⚡ Real-time Neural Mapping**: High-speed image processing for instant safety status.
-   **🐍 Advanced Biosafety Engine**: Trained on over 33,000 specimens to recognize unique scale "fingerprints".
-   **🚨 Dynamic Danger Alerts**: Visual and haptic cues (on supported devices) for immediate caution.
-   **📈 Activity Intelligence**: Tracks recent scans and identification history for environmental assessment.
-   **🩹 Safety Integrated**: Built-in protective tips and wildlife interaction guidelines.

---

## 🏗️ Architecture

### Intelligence Hub (Backend)
-   **Language**: Python 3.9+
-   **Core**: TensorFlow/Keras (CNN)
-   **API**: FastAPI/Flask (High-concurrency neural core)
-   **Models**: Custom-tuned `upgraded_snake_model.keras` optimized for scale pattern recognition.

### Interaction Hub (Frontend)
-   **Framework**: React 18 with Vite
-   **Styling**: Premium Glassmorphism & High-Contrast Safety UI
-   **Icons**: Lucide-react for semantic visual communication
-   **Performance**: Zero-latency UI updates using optimized state management

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/VenomGuard-Pro.git
cd VenomGuard-Pro
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Development Workflow

The project includes several research notebooks located in the `/Models` directory:
- `Snake_Classification_with_CNN.ipynb`: Primary model architecture and training logic.
- `Logistic_Model.ipynb` & `SVM_Model.ipynb`: Baseline comparison models.
- `Clustering_UnSupervised.ipynb`: Feature space exploration.

---

## 📁 File Structure & Git Best Practices

To maintain a clean and professional repository, ensure the following structure is respected:

```text
VenomGuard-Pro/
├── backend/            # Python Neural Core
│   ├── models/         # Production Model Weights (.keras)
│   ├── main.py         # API Gateway
│   └── train_cnn.py    # Training Pipeline
├── frontend/           # React Interface
│   ├── src/            # UI Components & Logic
│   └── public/         # Static Assets
├── Models/             # R&D Jupyter Notebooks
└── Data/               # (Git Ignored) Raw Training Data
```

> [!IMPORTANT]
> **Files to Commit**: Source code (`.py`, `.jsx`, `.css`), configuration files (`package.json`, `requirements.txt`), and Jupyter notebooks.
> **Files to Ignore**: `node_modules/`, `venv/`, and large raw dataset folders (handled by `.gitignore`).

---

## 👤 Developer
**Chathuka Pehesara**
*2025 Biosafety AI Initiative*

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
