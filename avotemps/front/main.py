import json
import streamlit as st
import pandas as pd
import numpy as np
import requests
import time


st.title('A Vos Temps')

dtf = pd.DataFrame({'Actions': ['Pas d actions']})

my_table = st.table(dtf)


while True:
    #res = requests.get('https://europe-west1-shift-aihack-nantes24-2.cloudfunctions.net/get_activities')
    res = requests.get('https://localhost:8080/get_activities')
    dtf = pd.DataFrame({'Actions': res.json()})
    my_table.add_rows(dtf)
    time.sleep(5)
