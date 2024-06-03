gcloud functions deploy log_activity \
--region=europe-west1 \
--runtime=python311 \
--source=. \
--entry-point=log_screen \
--project=shift-aihack-nantes24-2 \
--allow-unauthenticated \
--trigger-http
