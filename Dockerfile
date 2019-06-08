FROM ethereum/client-go:latest

COPY ./scripts /scripts
RUN apk add --update nodejs nodejs-npm bash git make && rm -rf /var/cache/apk/*
RUN cd /scripts && npm install

ENTRYPOINT ["/scripts/tgeth.sh"]
CMD []

