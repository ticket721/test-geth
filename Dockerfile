FROM golang:1.12-alpine as builder

COPY ./scripts /scripts
RUN apk add --no-cache make gcc musl-dev linux-headers git
RUN git clone https://github.com/ethereum/go-ethereum /go-ethereum
RUN cp /scripts/overrides/consensus/ethash/consensus.go /go-ethereum/consensus/ethash/consensus.go
RUN cd /go-ethereum \
&& make geth

FROM alpine:latest

COPY ./scripts /scripts

COPY --from=builder /go-ethereum/build/bin/geth /usr/local/bin/

RUN apk add --update nodejs nodejs-npm bash haveged openrc --no-cache \
&& rm -rf /var/cache/apk/* \
&& rc-update add haveged

RUN haveged -w 1024

RUN cd /scripts && npm install

ENTRYPOINT ["/scripts/tgeth.sh"]
CMD []

