from supabase import create_client, Client
import os
from dotenv import load_dotenv
from dto import UserDTO


# Load environment variables from .env file
load_dotenv()

def init_supabase() -> Client:
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables.")
    return supabase

def fetch_additional_context(supabase: Client, prompt: str) -> str:
    # Dummy implementation for fetching additional context from Supabase
    # Replace this with actual Supabase query logic
    context = "Additional context fetched from Supabase related to the prompt."
    return context


def fetch_user_info(supabase: Client, user_id: str) -> UserDTO:
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()

        # Assuming the first item in data list is the user's data
        user_data = response.data[0]

        # Map the data from the query to the UserDTO fields
        return UserDTO(user_data)
    except Exception as e:
        raise ValueError(f"Error fetching user info: {e}")
    

def update_user_info(supabase: Client, user: UserDTO) -> bool:
    try:
        user_dict = {
            "id": user.id,
            "login": user.login,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "doctor_name": user.doctor_name,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "first_login": user.first_login,
            "diagnosis": user.diagnosis,
            "treatment": user.treatment,
            "notes": user.notes,
            "settings_who": user.settings_who,
            "settings_how": user.settings_how,
            "settings_pseudo": user.settings_pseudo,
            "settings_tone": user.settings_tone,
            "settings_depth": user.settings_depth,
            "settings_format": user.settings_format,
            "settings_mood": user.settings_mood,
            "settings_language": user.settings_language
        }
        response = supabase.table("users").upsert(user_dict).execute()
        return UserDTO(response.data[0])
    except Exception as e:
        raise ValueError(f"Error updating user info: {e}")

    
 

