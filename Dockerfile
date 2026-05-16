FROM denoland/deno:debian
ARG USER="1000"
RUN mkdir -p /deno-dir && chown $USER:$USER /srv /deno-dir
WORKDIR /srv
COPY --chown=$USER:$USER . /srv
USER $USER
RUN deno install