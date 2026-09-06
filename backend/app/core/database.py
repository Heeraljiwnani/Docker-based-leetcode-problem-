import time

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def wait_for_db(retries: int = 10, delay: int = 3):
    """
    Retries the DB connection a few times before giving up.
    Useful when Postgres and the backend start at the same time
    inside Docker Compose - Postgres can take a couple of seconds
    to accept connections.
    """
    for attempt in range(1, retries + 1):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            print("Database connected successfully")
            return True
        except OperationalError as e:
            print(
                f"Database not ready yet (attempt {attempt}/{retries}): {e}"
            )
            time.sleep(delay)

    print("Could not connect to the database after multiple attempts.")
    return False
