import fs from 'node:fs';import {createBrotliDecompress}from 'node:zlib';import readline from 'node:readline';
const [file,collection='frozen1008',id='887']=process.argv.slice(2);if(!file)throw Error('Usage: node narzedzia/read_plans_v27.mjs file.jsonl.br collection id');
const input=fs.createReadStream(file),unpack=createBrotliDecompress();input.pipe(unpack);const lines=readline.createInterface({input:unpack,crlfDelay:Infinity});let found=false;
try{for await(const line of lines){const row=JSON.parse(line);if((row.collection===collection||collection==='*')&&(String(row.id)===id||row.name===id)){process.stdout.write(JSON.stringify(row,null,2)+'\n');found=true;break;}}}finally{lines.close();input.destroy();unpack.destroy();}
if(!found){console.error('No matching plan');process.exitCode=1;}
