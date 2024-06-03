FROM python:3.11

# Expose port you want your app on
EXPOSE 8080

WORKDIR app/ 

# Upgrade pip and install requirements
COPY requirements.txt requirements.txt
RUN pip install -U pip
RUN pip install -r requirements.txt

# Copy app code and set working directory
COPY main.py main.py

HEALTHCHECK CMD curl --fail http://localhost:8080/_stcore/health

# Run
CMD ["streamlit", "run", "main.py", "--server.port=8080", "--server.address=0.0.0.0", "--browser.gatherUsageStats", "false"]
