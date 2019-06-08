const max = process.env.ACCOUNT_NUMBER ? parseInt(process.env.ACCOUNT_NUMBER) : 10;

const res = Array.apply(null, {length: max}).map(Number.call, Number);

console.log(JSON.stringify(res).slice(1, -1));
