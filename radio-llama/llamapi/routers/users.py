from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends, status

from llamapi.container import ServerContainer
from llamapi.domain.user import UserCreate, User
from llamapi.services.user_service import UserService

router = APIRouter()


@router.post(
    "/user",
    status_code=status.HTTP_201_CREATED,
    response_model=User,
)
@inject
def create_user(
        user: UserCreate,
        user_service: UserService = Depends(Provide[ServerContainer.user_service]),
) -> User:
    return user_service.create_user(user)


@router.get(
    "/user/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=User,
)
@inject
def get_user_by_id(
        user_id: str,
        user_service: UserService = Depends(Provide[ServerContainer.user_service]),
) -> User:
    return user_service.get_user_by_id(user_id)


@router.get(
    "/login/",
    status_code=status.HTTP_200_OK,
    response_model=User,
)
@inject
def get_user_by_id(
        user_id: str,
        user_service: UserService = Depends(Provide[ServerContainer.user_service]),
) -> User:
    return user_service.get_user_by_id(user_id)
