# Segmentation de fruits avec YOLOv8

Ce projet permet de **segmenter des fruits dans des images** en utilisant le modèle **YOLOv8 Segmentation**. Il contient un backend en Python pour l'inférence et une interface pour l'affichage des résultats.

---

## Configuration du modèle – Roboflow

Le modèle YOLOv8 est hébergé sur **Roboflow**. Pour l’utiliser dans le backend, il est nécessaire de fournir une **clé API personnelle**. Cette clé permet de **télécharger le modèle entraîné et ses poids** depuis votre compte Roboflow.

---

## Segmentation

### Entraînement du modèle

Le modèle YOLOv8 Segmentation a été entraîné sur des images de fruits avec **un seul fruit par image** pour obtenir une segmentation précise.

---

## Dataset

### Description générale

Le dataset contient **6223 images** avec **13008 annotations**. Chaque image contient un **seul fruit annoté pour la segmentation**.

- Nombre d'images : 6223  
- Annotations manquantes : 0  
- Exemples nuls : 0  
- Annotations par image (moyenne) : 2.1  
- Nombre de classes : 8  
- Taille moyenne des images : 0.41 MP  
- Ratio médian : 640x640  

### Classes et distribution

| Classe | Nombre d’annotations |
|--------|--------------------|
| Mangue | 1723               |
| Raisin | 1716               |
| Banane | 1665               |
| Kiwi   | 1662               |
| Orange | 1630               |
| Pomme  | 1577               |
| Ananas | 1550               |
| Fraise | 1485               |

### Annotation

Chaque fruit dans une image a été annoté avec un **masque de segmentation** pour permettre au modèle d’apprendre **la forme exacte du fruit**.

---

## Résultats obtenus

Après entraînement, les performances sur le **jeu de test** sont :

- mAP@0.5 (mean Average Precision) : 0.82  
- mAP@0.5:0.95 : 0.74  
- Précision moyenne : 0.85  
- Recall moyen : 0.81  

Le modèle est capable de **segmenter avec précision chaque fruit**, même dans des images avec **plusieurs fruits ou des variations de luminosité**.

---

## Visualisation

Après l’inférence, chaque fruit est affiché avec :

- Masque coloré correspondant à la classe  
- Nom de la classe et score de confiance  
- Possibilité de téléchargement des images segmentées  

---

## Interface

L'interface permet :

- Téléchargement d'image ou saisie d'une URL  
- Affichage de l'image originale et de l'image segmentée côte à côte  
- Affichage des masques colorés et des classes détectées avec score  
- Téléchargement de l'image segmentée  

---

## Backend

Le backend est développé en **Python** avec :

- **FastAPI** pour l'API REST  
- **YOLOv8** via Roboflow pour la segmentation  
- Gestion des fichiers uploadés ou via URL  

### Fonctionnement

1. L'interface envoie une image ou URL au backend  
2. Le backend utilise la clé API Roboflow pour charger le modèle YOLOv8  
3. Le modèle effectue la segmentation et renvoie les résultats (polygones, classes, confiance)  
4. L'interface affiche les résultats sur un canvas  

---

## Lancement du projet

1. Cloner le dépôt :

```bash
git clone https://github.com/YOUNESELBOUKNIFY/segmentation-fruits.git
```

2. Installer les dépendances backend :



``` bash
pip install -r requirements.txt
```

3. Lancer le backend :

```bash
cd Fruis_segmentation 
uvicorn app:app --reload
```

Ouvrir l'interface dans un navigateur et tester l'application.



