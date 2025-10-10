ée :


# 🍓 Segmentation de fruits avec YOLOv8

Ce projet permet de **segmenter des fruits dans des images** en utilisant le modèle **YOLOv8 Segmentation**. Il contient un backend en Python pour l'inférence et un frontend en React pour l'affichage des résultats.

---

## 🔑 Configuration du modèle – Roboflow

Le modèle YOLOv8 est hébergé sur **Roboflow** et pour l’utiliser dans le backend, il est nécessaire de fournir une **clé API personnelle**. Cette clé permet de **télécharger le modèle entraîné et ses poids** directement depuis votre compte Roboflow.

---

## 🖼️ Segmentation

### 📘 Entraînement du modèle

Le modèle YOLOv8 Segmentation a été entraîné sur des images de fruits avec **un seul fruit par image** pour obtenir une segmentation précise.  
    

---

## 🗂️ Dataset

### Description générale

Le dataset contient **6223 images** avec **13008 annotations**. Chaque image contient un **seul fruit annoté pour la segmentation**.

- **Nombre d'images** : 6223
- **Annotations manquantes** : 0
- **Exemples nuls** : 0
- **Annotations par image (moyenne)** : 2.1
- **Nombre de classes** : 8
- **Taille moyenne des images** : 0.41 MP
- **Ratio médian** : 640x640
    

###  Classes et distribution

|Classe|Nombre d’annotations|
|---|---|
|Mangue|1723|
|Raisin|1716|
|Banane|1665|
|Kiwi|1662|
|Orange|1630|
|Pomme|1577|
|Ananas|1550|
|Fraise|1485|

---

### 🧾 Annotation

Chaque fruit dans une image a été annoté avec :

- **Masque de segmentation** : Permet au modèle d’apprendre **la forme exacte du fruit**, pas seulement sa localisation.
    
---

### 📊 Résultats obtenus

Après entraînement, les performances sur le **jeu de test** sont :
- **mAP@0.5 (mean Average Precision)** : 0.82
- **mAP@0.5:0.95** : 0.74
- **Précision moyenne** : 0.85
- **Recall moyen** : 0.81
    
Le modèle est capable de **segmenter avec précision chaque fruit**, même dans des images présentant **plusieurs fruits ou des variations de luminosité**.

---

### 🖼️ Visualisation

Après l’inférence, chaque fruit est affiché avec :
- **Masque coloré** correspondant à la classe
- **Nom de la classe et score de confiance**
- **Possibilité de téléchargement** des images segmentées

---

## 🖥️ Frontend

Le frontend est développé en **React** avec les fonctionnalités suivantes :

- Téléchargement d'image ou saisie d'une URL
- Affichage de l'image originale et de l'image segmentée côte à côte
- Affichage des **masques colorés** et **classes détectées avec score**
- Téléchargement de l'image segmentée

### Technologies utilisées

- React.js
- Axios pour la communication avec le backend
- HTML5 Canvas pour l'affichage des résultats

---

## 🛠️ Backend

Le backend est développé en **Python** avec :
- **FastAPI** pour l'API REST
- **YOLOv8** via Roboflow pour la segmentation
- Gestion des fichiers uploadés ou via URL
### Fonctionnement
1. Le frontend envoie une image ou URL au backend.
2. Le backend utilise la clé API Roboflow pour charger le modèle YOLOv8.
3. Le modèle effectue la segmentation et renvoie les résultats (polygones, classes, confiance).
4. Le frontend affiche les résultats sur un canvas.

---

## ⚡ Lancement du projet

1. Cloner le dépôt :
    

```bash
git clone https://github.com/YOUNESELBOUKNIFY/segmentation-fruits.git
cd segmentation-fruits
```

2. Installer les dépendances backend :

```bash
pip install -r requirements.txt
```

3. Installer les dépendances frontend 

```bash
cd frontend
npm install
```

4. Lancer le backend :
```bash
uvicorn main:app --reload
```
5. Lancer le frontend :

```bash
npm start
```

6. Accéder à l'application sur `http://localhost:3000`

---
