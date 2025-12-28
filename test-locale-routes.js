const http = require('http');

// Test different locale routes
const locales = ['en', 'zh', 'ar', 'es', 'pt', 'fr', 'ru', 'ja'];

// Test function
async function testLocaleRoutes() {
  console.log('Testing locale routes...');
  console.log('=' . repeat(50));
  
  for (const locale of locales) {
    try {
      await testRoute(locale);
    } catch (error) {
      console.error(`Error testing /${locale}:`, error.message);
    }
    console.log('-'.repeat(50));
  }
}

// Test single route
function testRoute(locale) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path: `/${locale}`,
      method: 'GET',
      headers: {
        'Accept': 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Route: /${locale}`);
        console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        console.log(`Content-Length: ${res.headers['content-length'] || 'N/A'}`);
        
        // Check if it's HTML content
        if (res.headers['content-type'] && res.headers['content-type'].includes('text/html')) {
          console.log('Content: HTML response received');
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Run the tests
testLocaleRoutes().then(() => {
  console.log('All tests completed!');
}).catch((error) => {
  console.error('Tests failed:', error);
  process.exit(1);
});