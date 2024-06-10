# Utiliser une image de base Miniconda officielle
FROM python

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

RUN pip install flask Flask-Cors google.generativeai python-dotenv vertexai pytesseract pyMuPDF

# Copier le reste de l'application dans le répertoire de travail
COPY . .

# Commande par défaut pour exécuter l'application
# Remplacer `app.py` par le nom de votre fichier Python principal
CMD ["python3", "app.py"]