const fs = require('fs');

// 读取IP
const ipData = JSON.parse(fs.readFileSync('ip_all.json', 'utf8'));
let allIPs = [];
for (let key in ipData.ip_list) allIPs = allIPs.concat(ipData.ip_list[key]);
const firstIP = allIPs[0];

// 读取模板并全局替换 ${replace}
let txt = fs.readFileSync('interface.txt', 'utf8');
txt = txt.replace(/\$\{replace\}/g, firstIP);

// 输出
fs.writeFileSync('migu.txt', txt, 'utf8');
console.log('✅ 替换成功！IP =', firstIP);
