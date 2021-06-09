FROM python:3.9.4-slim-buster
ARG app_path

COPY $app_path /app
WORKDIR /app

COPY ./install/install.sh /app
COPY ./install/lin-reqs.txt /app

RUN chmod +x install.sh
RUN . ./install.sh

COPY ./install/start.sh /start.sh

RUN chmod +x /start.sh

CMD ["/start.sh"]