from uuid import UUID

from pydantic import BaseModel, SecretStr, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    name: str
    password: SecretStr


class UserAuthenticate(UserBase):
    password: SecretStr


class User(UserBase):
    id: UUID
    name: str
