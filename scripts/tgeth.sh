#! /bin/bash

echo "Create Datadir"

mkdir -p ${DATADIR}
mkdir ${DATADIR}/keystore

echo "Generate Genesis"

node /scripts/setup_accounts.js

cat ${DATADIR}/custom_genesis.json

geth --datadir ${DATADIR}/data --networkid ${NET_ID} --nodiscover init ${DATADIR}/custom_genesis.json
geth --datadir ${DATADIR}/data --keystore ${DATADIR}/keystore --networkid ${NET_ID} --allow-insecure-unlock --unlock $(node /scripts/unlock_arg.js) --password ${DATADIR}/password --etherbase 0 --mine --minerthreads 1 console $@


