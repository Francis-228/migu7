const fs = require('fs');

// 1. 先打印当前目录的文件，方便排查
console.log('当前目录文件：', fs.readdirSync('./'));

try {
  // 2. 读取IP列表
  const ipRaw = fs.readFileSync('./ip_all.json', 'utf8');
  const ipData = JSON.parse(ipRaw);
  
  // 3. 合并所有IP分组
  let allIps = [];
  for (let group in ipData.ip_list) {
    allIps = allIps.concat(ipData.ip_list[group]);
  }
  
  // 4. 只取前7个IP
  const useIps = allIps.slice(0, 7);
  console.log('使用的IP：', useIps);

  // 5. 生成多IP文件
  function makeFile(templatePath, outputPath) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const lines = template.split(/\r?\n/);
    let result = [];

    for (const line of lines) {
      if (line.startsWith('#EXT') || line.trim() === '') {
        result.push(line);
        continue;
      }
      if (line.includes('${replace}')) {
        for (const ip of useIps) {
          result.push(line.replace(/\$\{replace\}/g, ip));
        }
      } else {
        result.push(line);
      }
    }

    fs.writeFileSync(outputPath, result.join('\n'), 'utf8');
    console.log('生成成功：', outputPath);
  }

  // 6. 生成两个文件
  makeFile('./interface.txt', './可用-interface.txt');
  makeFile('./interfaceTXT.txt', './可用-interfaceTXT.txt');

} catch (err) {
  // 7. 打印错误，让你知道哪里出问题
  console.error('脚本执行失败：', err.message);
  console.error('错误栈：', err.stack);
  process.exit(1);
}
