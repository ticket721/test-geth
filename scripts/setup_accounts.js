const bip39 = require('bip39');
const hdkey = require('hdkey');
const utils = require('ethereumjs-util');
const Wallet = require('ethereumjs-wallet');
const fs = require('fs');
const path = require('path');

if (process.env.MNEMONIC && process.env.DATADIR && process.env.NET_ID) {
    const genesis =
        JSON.parse(
            `
 {
    "config": {
        "chainId": ${process.env.NET_ID},
        "homesteadBlock": 0,
        "byzantiumBlock": 0,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "eip158Block": 0
    },
    "nonce": "0x0000000000000042",
    "timestamp": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "gasLimit": "0xffffffffff",
    "difficulty": "0x0",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "alloc": {
    },
    "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000//ADDRESS//0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}
`
        );

    const seed = bip39.mnemonicToSeedSync(process.env.MNEMONIC);
    const root = hdkey.fromMasterSeed(seed);
    const max = process.env.ACCOUNT_NUMBER ? parseInt(process.env.ACCOUNT_NUMBER) : 10;
    let extraDataInput = '';
    console.log(`Generating ${max} accounts`)
    for (let idx = 0; idx < max; ++idx) {
        const derived = root.derive(`m/44'/60'/0'/0/${idx}`);
        const address = '0x' + utils.privateToAddress(derived.privateKey).toString('hex');
        if (idx === 0) {
            genesis.coinbase = address;
            extraDataInput += address.slice(2);
        }

        genesis.alloc[address] = {
            balance: '0x56BC75E2D63100000'
        };


        const wallet = Wallet.fromPrivateKey(derived.privateKey);

        const v3 = wallet.toV3('test');

        fs.writeFileSync(path.join(process.env.DATADIR, 'keystore', address), JSON.stringify(v3, null, 4));
        console.log('Written keystore and genesis entry for ', address);
    }

    genesis.extraData = genesis.extraData.replace('//ADDRESS//', extraDataInput);

    fs.writeFileSync(path.join(process.env.DATADIR, 'password'), 'test');
    fs.writeFileSync(path.join(process.env.DATADIR, 'custom_genesis.json'), JSON.stringify(genesis, null, 4));
    console.log('Written Custom Genesis');
}
