FROM python:3.9.4-slim-buster
ARG app_path

COPY $app_path /app
COPY $app_path/.env.example /app/.env
WORKDIR /app

RUN apt-get update && /usr/local/bin/python -m pip install --upgrade pip && pip install --no-cache-dir matplotlib pandas
RUN pip install --no-cache-dir -r  ./install/lin-reqs.txt

CMD ["gunicorn", "-w 2", "-k uvicorn.workers.UvicornH11Worker", "main:app", "-b localhost:5353"]