import fs from 'node:fs';
import https from 'node:https';

const SITE_URL = 'https://www.dariocruz.dev';
const KEY = 'e07149341bdf469baa19a75625c4b56d';
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const SITEMAP_PATH = 'build/sitemap.xml';

if (!fs.existsSync(SITEMAP_PATH)) {
  console.error(`Missing ${SITEMAP_PATH}. Run "npm run build" first.`);
  process.exit(1);
}

const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urls.length === 0) {
  console.error('No URLs found in sitemap.xml.');
  process.exit(1);
}

const payload = JSON.stringify({
  host: new URL(SITE_URL).hostname,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
});

const req = https.request(
  'https://api.indexnow.org/indexnow',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      const ok = res.statusCode >= 200 && res.statusCode < 300;
      if (ok) {
        console.log(`IndexNow submit ok (${res.statusCode}) for ${urls.length} URLs.`);
      } else {
        console.error(`IndexNow submit failed (${res.statusCode}).`);
        if (body) console.error(body);
        process.exit(1);
      }
    });
  }
);

req.on('error', (err) => {
  console.error(`IndexNow submit error: ${err.message}`);
  process.exit(1);
});

req.write(payload);
req.end();
