FROM public.ecr.aws/docker/library/python:3.12-alpine3.20
ARG APP_PORT=8000

RUN adduser --system --no-create-home app && apk add curl

EXPOSE $APP_PORT

COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

RUN mkdir -p /src
COPY src/ /src/

USER app
WORKDIR /src
CMD fastapi run ./app.py

HEALTHCHECK --interval=5s --timeout=5s --retries=5 CMD curl -f http://0.0.0.0:${APP_PORT}/health || exit 1
