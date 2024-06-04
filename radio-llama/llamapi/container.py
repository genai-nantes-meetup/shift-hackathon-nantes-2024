from dependency_injector import containers, providers

from llamapi.config import settings
from llamapi.infra.database.database_manager import Database
from llamapi.infra.repositories import users
from llamapi.services.user_service import UserService


class ServerContainer(containers.DeclarativeContainer):
    db_url = settings.db_url
    db = providers.Singleton(
        Database,
        db_url=db_url,
    )

    user_repository = providers.Factory(
        users.SqlAlchemyRepository,
        session_factory=db.provided.session,
    )

    user_service = providers.Factory(
        UserService,
        user_repository=user_repository,
    )
