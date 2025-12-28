const fs = require('fs');
const path = require('path');

// 读取JSON文件并检查重复键
function checkDuplicateKeys(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const obj = JSON.parse(content);
    
    const keys = new Set();
    const duplicates = new Set();
    
    // 递归检查所有键
    function check(obj, parent = '') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const fullKey = parent ? `${parent}.${key}` : key;
          
          if (keys.has(fullKey)) {
            duplicates.add(fullKey);
          } else {
            keys.add(fullKey);
          }
          
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            check(obj[key], fullKey);
          }
        }
      }
    }
    
    check(obj);
    
    if (duplicates.size > 0) {
      console.log(`File: ${filePath}`);
      console.log(`Duplicate keys found: ${Array.from(duplicates).join(', ')}`);
      return duplicates;
    } else {
      console.log(`File: ${filePath} - No duplicate keys found.`);
      return null;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return null;
  }
}

// 检查所有语言文件
const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));

let allDuplicates = new Set();

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const duplicates = checkDuplicateKeys(filePath);
  if (duplicates) {
    duplicates.forEach(key => allDuplicates.add(key));
  }
});

console.log('\nSummary:');
if (allDuplicates.size > 0) {
  console.log(`Found ${allDuplicates.size} unique duplicate keys across files:`);
  console.log(Array.from(allDuplicates).join(', '));
} else {
  console.log('No duplicate keys found in any file!');
}
