FROM denoland/deno:alpine
ARG USER="1000"
RUN mkdir -p /deno-dir && chown $USER:$USER /srv /deno-dir \
 && apk add --no-cache libstdc++
WORKDIR /srv
COPY --chown=$USER:$USER . /srv
USER $USER
RUN deno install