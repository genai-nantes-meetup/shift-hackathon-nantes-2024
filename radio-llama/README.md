Procédure de déploiement :


- Backend : merge sur main
- Front end : TBD
- Fief : TBD


## How to locally test (DEMO)

- Go to the folder `llamapy/utils_romain` and copy the `.env.dist` file to `.env`

- Get the required API key from Eleven Labs, Mistral and Spotify and fill the `.env` file with the correct values

- Install the dependencies with `pip install -r requirements.txt`

- Open the file `radio.py` and change the 'genre' variable at the start of the file to the genre you want to test

- Run the script with `python3 radio.py`