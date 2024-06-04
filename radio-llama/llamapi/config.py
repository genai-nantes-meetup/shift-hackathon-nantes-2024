import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str = os.getenv('DB_URL', "postgresql://u7upn54bud1ojtcuepwt:n2FNCqUgZH9L5iLUVfSaUUGDUNylQm@bjhb4o7qbkzxq65plbck-postgresql.services.clever-cloud.com:50013/bjhb4o7qbkzxq65plbck")


settings = Settings()
print(settings.db_url)
