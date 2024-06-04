from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from llamapi.config import settings

engine_kwargs = {}
if "sqlite" in settings.db_url:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
engine = create_engine(settings.db_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
