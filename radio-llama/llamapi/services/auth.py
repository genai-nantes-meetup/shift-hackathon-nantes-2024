from fastapi.security import OAuth2AuthorizationCodeBearer
from fief_client import FiefAsync
from fief_client.integrations.fastapi import FiefAuth


class AuthService:
    def __init__(self, settings):
        fief = FiefAsync(
            settings.fief_domain,
            settings.fief_client_id,
            settings.fief_client_secret,
        )

        scheme = OAuth2AuthorizationCodeBearer(
            settings.fief_domain + "/authorize",
            settings.fief_domain + "/llamapi/token",
            scopes={"openid": "openid", "offline_access": "offline_access"},
            auto_error=False,
        )

        self.auth = FiefAuth(fief, scheme)

    def authenticated(self):
        return self.auth.authenticated()
