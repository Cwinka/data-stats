
from config import app
from settings import *
from apps.cloud_files import urls
from apps.graphs import urls
from apps.statistics import urls
from apps.simple_ai import urls



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)