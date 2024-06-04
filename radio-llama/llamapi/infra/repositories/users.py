from contextlib import AbstractContextManager
from typing import Callable
from uuid import UUID, uuid4

import bcrypt
from fastapi import HTTPException

from llamapi.domain.user import User, UserCreate, UserAuthenticate
from llamapi.infra.database.sql_models import User as SqlModelUser


class SqlAlchemyRepository:
    def __init__(self, session_factory) -> Callable[..., AbstractContextManager]:
        self.session_factory = session_factory

    def create_user(self, user: UserCreate) -> User:
        """Creates a user in the database
        :returns: A User in pyDantic BaseModel format.
        :rtype: schemas.User
        """
        with self.session_factory() as session:
            db_user = SqlModelUser(
                id=uuid4(),
                name=user.name,
                email=user.email,
                hashed_password=self._hash_password(user.password.get_secret_value()),
            )
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            return self.map_sql_to_schema(db_user)

    def get_user_by_id(self, user_id: UUID) -> User:
        """Find an user in database and retrieves it

        :user_id: The id of the user to retrieve.
        :returns: An User in pyDantic BaseModel format.
        :rtype: schemas.User
        """
        with self.session_factory() as session:
            e = session.query(SqlModelUser).filter(SqlModelUser.id == user_id).first()
            if e is None:
                raise HTTPException(status_code=404, detail=f"User {user_id} not found")
            return self.map_sql_to_schema(e)

    def verify_user(self, user: UserAuthenticate) -> bool:
        with self.session_factory() as session:
            e = (
                session.query(SqlModelUser)
                .filter(SqlModelUser.email == user.email)
                .first()
            )
            if e is None:
                return None
            is_verified = bcrypt.checkpw(
                user.password.get_secret_value().encode("utf-8"),
                e.hashed_password.encode("utf-8"),
            )
            return is_verified

    @staticmethod
    def _hash_password(password):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def map_sql_to_schema(sql_user: SqlModelUser) -> User:
        """Sql To Pydantic Mapper

        :returns: An User in pyDantic BaseModel format.
        :rtype: schemas.User
        """
        return User(
            id=sql_user.id,
            name=sql_user.name,
            email=sql_user.email,
        )
