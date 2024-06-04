import traceback
from contextlib import AbstractContextManager, contextmanager
from typing import Callable

from sqlalchemy import create_engine, exc, orm
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session


Base = declarative_base()


class Database:
    def __init__(self, db_url: str) -> None:
        self._engine = create_engine(db_url, echo=True)
        self._session_factory = orm.scoped_session(
            orm.sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self._engine,
            ),
        )

    def create_database(self) -> None:
        Base.metadata.create_all(self._engine)

    @contextmanager
    def session(self) -> Callable[..., AbstractContextManager]:
        session: Session = self._session_factory()
        try:
            yield session
        except Exception as e:
            print(e)
        finally:
            session.rollback()
            session.close()
