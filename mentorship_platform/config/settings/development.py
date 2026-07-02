from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# Fallback to SQLite for local development when PostgreSQL is not available
try:
    _db_host = config('POSTGRES_HOST')
except Exception:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
