const fs = require('fs');
const http = require('http');
const https = require('https');

// ====================== 配置 ======================
const TIMEOUT = 3000;
const TEST_PATH = '/ping';
const TOP_IP_COUNT = 7;
// ==================================================

// 1. 读取IP
const raw = fs.readFileSync('ip_all.json', 'utf8');
const data = JSON.parse(raw);

let allIPs = [];
Object.values(data.ip_list).forEach(ips => {
  allIPs = allIPs.concat(ips);
});

console.log(`📶 共加载 ${allIPs.length} 个IP`);

// 2. 测速函数
function testSpeed(ip) {
  return new Promise(resolve => {
    const url = `http://${ip}${TEST_PATH}`;
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, res => {
      res.resume();
      res.on('end', () => {
        const time = Date.now() - start;
        resolve({ ip, time });
      });
    });

    req.setTimeout(TIMEOUT, () => {
      req.destroy();
      resolve({ ip, time: 99999 });
    });

    req.on('error', () => {
      resolve({ ip, time: 99999 });
    });
  });
}

// 3. 获取最快的N个IP
async function getTopFastIPs(count) {
  const tasks = allIPs.map(ip => testSpeed(ip));
  const results = await Promise.all(tasks);
  const valid = results.filter(r => r.time < 99999);
  valid.sort((a, b) => a.time - b.time);
  const top = valid.slice(0, count);
  return top.map(t => t.ip);
}

// 4. 生成多IP文件（单文件，多地址）
function generateMultiIpFile(template, output, ips) {
  const lines = fs.readFileSync(template, 'utf8').split(/\r?\n/);
  let outputLines = [];

  for (const line of lines) {
    if (line.startsWith('#EXT')) {
      outputLines.push(line);
      continue;
    }
    if (line.trim() === '') {
      outputLines.push('');
      continue;
    }
    if (line.includes('${replace}')) {
      for (const ip of ips) {
        outputLines.push(line.replace(/\$\{replace\}/g, ip));
      }
    } else {
      outputLines.push(line);
    }
  }

  fs.writeFileSync(output, outputLines.join('\n'), 'utf8');
  console.log(`✅ 生成完成：${output}`);
}

// 5. 主程序
(async () => {
  const topIPs = await getTopFastIPs(TOP_IP_COUNT);
  console.log(`🏆 最快 ${TOP_IP_COUNT} 个IP：`);
  topIPs.forEach((ip, i) => console.log(` ${i+1}. ${ip}`));

  generateMultiIpFile('interface.txt', '可用-interface.txt', topIPs);
  generateMultiIpFile('interfaceTXT.txt', '可用-interfaceTXT.txt', topIPs);
})();
