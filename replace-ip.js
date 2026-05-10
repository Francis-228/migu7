const fs = require('fs');

// 读取 IP
const data = JSON.parse(fs.readFileSync('ip_all.json','utf8'));
let ips = [];
for(let k in data.ip_list) ips = ips.concat(data.ip_list[k]);

// 只取前7个
const useIPs = ips.slice(0,7);

// 生成 interface.txt
function make(inFile, outFile){
  let txt = fs.readFileSync(inFile,'utf8');
  useIPs.forEach(ip => {
    txt = txt.replace('${replace}', ip);
  });
  fs.writeFileSync(outFile, txt, 'utf8');
}

make('interface.txt', '可用-interface.txt');
make('interfaceTXT.txt', '可用-interfaceTXT.txt');
