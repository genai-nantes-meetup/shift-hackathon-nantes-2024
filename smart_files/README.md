# Smart Files

Une application Electron avec Vue

## Python project setup

```bash
poetry install
```

## Python project setup

```
pip install -r requirements.txt
```

## Javascript project setup

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Javascript project setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## clé mistral

export MISTRAL_API_KEY=

## Generating the vectorDB

We need to simulate the way the electron app will call the scripts

```bash
# Generate absolute paths to files we want to ingest. It's hardcoded to pdf files in ./data
python smart_files/gen_json_input.py
# Generate embeddings for the first page of the pdfs
cat file_paths.json | python smart_files/populate_db.py
# Get best results from the VectorDB with the user prompt given as parameter
cat user_prompt.json | python smart_files/query_db.py
```

---

## Contexte

Ce projet a été réalisé lors du SHIFT Hackathon Gen IA de Nantes.

## Contributeurs

Ce projet a été mené en 24hr avec :

- **Maël Jallais** : Designer
- **Yanis Guaye** : Dev
- **Jibé Le Levier** : Dev
- **Laurent** : Data Science
- **Victor Degliame** : Data Science
- **Aurélie Poittier** : IA Product
- _et d'autres..._
