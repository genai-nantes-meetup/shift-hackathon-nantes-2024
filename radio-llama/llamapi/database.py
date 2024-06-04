class Database:
    def __init__(self, db_url: str) -> None:
        pass
        ##self._engine = create_engine(db_url, echo=True)
        ##self._session_factory = orm.scoped_session(
        ##    orm.sessionmaker(
        ##        autocommit=False,
        ##        autoflush=False,
        ##        bind=self._engine,
        ##    ),
        ##)

    def create_database(self):
        pass
        ##Base.metadata.create_all(bind=self._engine)
