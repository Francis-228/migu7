const fs = require('fs');

// 1. 读取IP列表
const ipRaw = fs.readFileSync('./ip_all.json', 'utf8');
const ipJson = JSON.parse(ipRaw);
let allIps = [];
Object.values(ipJson.ip_list).forEach(item => {
    allIps = allIps.concat(item);
});
// 取前7个IP
const useIps = allIps.slice(0, 7);

// 2. 读取你的单台模板 interface.txt
const tpl = fs.readFileSync('./interface.txt', 'utf8');

// 3. 组装最终内容
let final = '';
useIps.forEach(ip => {
    // 把模板里所有 ${replace} 换成当前真实IP
    let line = tpl.replace(/\$\{replace\}/g, ip);
    final += line + '\n';
});

// 4. 写入根目录 migu.txt
fs.writeFileSync('./migu.txt', final, 'utf8');
console.log('✅ 生成完成：1个台 7条IP线路，无变量');
