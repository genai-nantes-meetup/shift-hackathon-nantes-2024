from dataclasses import dataclass
from typing import Optional

@dataclass
class UserDTO:
    id: str
    login: str
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    doctor_name: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    first_login: Optional[bool] = None
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    settings_who: Optional[str] = None
    settings_pseudo: Optional[str] = None
    settings_mood: Optional[str] = None
    settings_how: Optional[str] = None
    settings_tone: Optional[str] = None
    settings_depth: Optional[str] = None
    settings_format: Optional[str] = None
    settings_language: Optional[str] = None

    def __init__(self, data: dict):
        self.id = data.get('id')
        self.login = data.get('login')
        self.email = data.get('email')
        self.first_name = data.get('first_name')
        self.last_name = data.get('last_name')
        self.doctor_name = data.get('doctor_name')
        self.created_at = data.get('created_at')
        self.updated_at = data.get('updated_at')
        self.first_login = data.get('first_login')
        self.diagnosis = data.get('diagnosis')
        self.treatment = data.get('treatment')
        self.notes = data.get('notes')
        self.settings_who = data.get('settings_who')
        self.settings_pseudo = data.get('settings_pseudo')
        self.settings_mood = data.get('settings_mood')
        self.settings_how = data.get('settings_how')
        self.settings_tone = data.get('settings_tone')
        self.settings_depth = data.get('settings_depth')
        self.settings_format = data.get('settings_format')
        self.settings_language = data.get('settings_language')

    def to_string(self):
        return (f"UserDTO(id={self.id}, login={self.login}, email={self.email}, first_name={self.first_name}, "
                f"last_name={self.last_name}, doctor_name={self.doctor_name}, created_at={self.created_at}, "
                f"updated_at={self.updated_at}, first_login={self.first_login}, diagnosis={self.diagnosis}, "
                f"treatment={self.treatment}, notes={self.notes}, settings_who={self.settings_who}, "
                f"settings_pseudo={self.settings_pseudo}, settings_mood={self.settings_mood}, settings_how={self.settings_how}, "
                f"settings_tone={self.settings_tone}, settings_depth={self.settings_depth}, settings_format={self.settings_format}, "
                f"settings_language={self.settings_language})")

    # Getters and Setters
    @property
    def id(self):
        return self._id
    
    @id.setter
    def id(self, value):
        self._id = value
    
    @property
    def login(self):
        return self._login
    
    @login.setter
    def login(self, value):
        self._login = value

    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, value):
        self._email = value

    @property
    def first_name(self):
        return self._first_name
    
    @first_name.setter
    def first_name(self, value):
        self._first_name = value

    @property
    def last_name(self):
        return self._last_name
    
    @last_name.setter
    def last_name(self, value):
        self._last_name = value

    @property
    def doctor_name(self):
        return self._doctor_name
    
    @doctor_name.setter
    def doctor_name(self, value):
        self._doctor_name = value

    @property
    def created_at(self):
        return self._created_at
    
    @created_at.setter
    def created_at(self, value):
        self._created_at = value

    @property
    def updated_at(self):
        return self._updated_at
    
    @updated_at.setter
    def updated_at(self, value):
        self._updated_at = value

    @property
    def first_login(self):
        return self._first_login
    
    @first_login.setter
    def first_login(self, value):
        self._first_login = value

    @property
    def diagnosis(self):
        return self._diagnosis
    
    @diagnosis.setter
    def diagnosis(self, value):
        self._diagnosis = value

    @property
    def treatment(self):
        return self._treatment
    
    @treatment.setter
    def treatment(self, value):
        self._treatment = value

    @property
    def notes(self):
        return self._notes
    
    @notes.setter
    def notes(self, value):
        self._notes = value

    @property
    def settings_who(self):
        return self._settings_who
    
    @settings_who.setter
    def settings_who(self, value):
        self._settings_who = value

    @property
    def settings_pseudo(self):
        return self._settings_pseudo
    
    @settings_pseudo.setter
    def settings_pseudo(self, value):
        self._settings_pseudo = value

    @property
    def settings_mood(self):
        return self._settings_mood
    
    @settings_mood.setter
    def settings_mood(self, value):
        self._settings_mood = value

    @property
    def settings_how(self):
        return self._settings_how
    
    @settings_how.setter
    def settings_how(self, value):
        self._settings_how = value

    @property
    def settings_tone(self):
        return self._settings_tone
    
    @settings_tone.setter
    def settings_tone(self, value):
        self._settings_tone = value

    @property
    def settings_depth(self):
        return self._settings_depth
    
    @settings_depth.setter
    def settings_depth(self, value):
        self._settings_depth = value

    @property
    def settings_format(self):
        return self._settings_format
    
    @settings_format.setter
    def settings_format(self, value):
        self._settings_format = value

    @property
    def settings_language(self):
        return self._settings_language
    
    @settings_language.setter
    def settings_language(self, value):
        self._settings_language = value
