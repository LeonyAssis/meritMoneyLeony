FROM node:12.15.0-alpine AS dev

ENV PATH="/application/node_modules/.bin:${PATH}"
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"
COPY docker/Gerencianet-CA.crt /usr/local/share/ca-certificates/Gerencianet-CA.crt
RUN apk update
RUN apk add git openssh ca-certificates bash sudo make build-base python3 libcap && update-ca-certificates
RUN git config --system url."https://".insteadOf git+https://
RUN mkdir -p /home/node/.ssh && \
  chmod 0700 /home/node/.ssh && \
  chown node:node /home/node/.ssh && \
  ssh-keyscan gitlab.interno.testegerencianet.com.br > /home/node/.ssh/known_hosts && \
  ssh-keyscan github.com >> /home/node/.ssh/known_hosts

RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && chmod 0440 /etc/sudoers.d/node
RUN sudo setcap cap_net_bind_service=+ep /usr/local/bin/node

CMD cd "/application" \
  && if [ "$WATCH_FILES" == "1" ]; then npm start; else node "app.js"; fi

