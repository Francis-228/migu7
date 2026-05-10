const fs = require('fs');

// 配置：生成7个IP
const TOP_IP_COUNT = 7;

// 读取IP
const raw = fs.readFileSync('ip_all.json', 'utf8');
const data = JSON.parse(raw);
let allIPs = [];
Object.values(data.ip_list).forEach(ips => allIPs = allIPs.concat(ips));

// 直接取前7个（跳过测速，GitHub不支持测速，这是报错根源！）
const topIPs = allIPs.slice(0, TOP_IP_COUNT);

// 生成多IP文件（单文件，7条地址）
function generate(template, out) {
  const lines = fs.readFileSync(template, 'utf8').split(/\r?\n/);
  const output = [];
  for (const line of lines) {
    if (line.startsWith('#EXT') || line.trim() === '') {
      output.push(line);
      continue;
    }
    if (line.includes('${replace}')) {
      topIPs.forEach(ip => {
        output.push(line.replace(/\$\{replace\}/g, ip));
      });
    } else {
      output.push(line);
    }
  }
  fs.writeFileSync(out, output.join('\n'), 'utf8');
}

// 生成
generate('interface.txt', '可用-interface.txt');
generate('interfaceTXT.txt', '可用-interfaceTXT.txt');
console.log('✅ 生成成功！');
