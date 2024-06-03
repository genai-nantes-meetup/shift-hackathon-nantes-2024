gcloud functions deploy get_activities \
--region=europe-west1 \
--runtime=python311 \
--source=. \
--entry-point=get_activities \
--project=shift-aihack-nantes24-2 \
--allow-unauthenticated \
--trigger-http
