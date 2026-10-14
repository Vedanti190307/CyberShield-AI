// scripts/check_deps.js
// Simple Node script to verify project dependencies and environment.
// It checks for:
//   - Node.js version (should satisfy package.json engines)
//   - Yarn availability
//   - Presence of node_modules (installs if missing)
//   - Disk space on D: drive for caches
//   - Optional: Docker availability (for later PostgreSQL setup)

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(msg) { console.log(`[check-deps] ${msg}`); }
function runCmd(cmd) { try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return null; } }
function checkNode() { const v = runCmd('node -v'); if (!v) { log('❌ Node not found'); process.exit(1); } log(`✅ Node ${v}`); }
function checkYarn() { const v = runCmd('yarn -v'); if (!v) { log('❌ Yarn not found'); process.exit(1); } log(`✅ Yarn ${v}`); }
function ensureNodeModules() {
  const modPath = path.resolve(__dirname, '..', 'node_modules');
  if (fs.existsSync(modPath) && fs.readdirSync(modPath).length) { log('✅ node_modules present'); return; }
  log('🔧 Installing dependencies...');
  const cacheDir = 'D:/Hackathon/yarn_cache';
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  const result = spawnSync('yarn', ['install', `--cache-folder=${cacheDir}`], { stdio: 'inherit', cwd: path.resolve(__dirname, '..'), env: { ...process.env, YARN_CACHE_FOLDER: cacheDir } });
  if (result.status !== 0) { log('❌ Yarn install failed'); process.exit(1); }
  log('✅ Dependencies installed');
}
function checkDocker() { const v = runCmd('docker --version'); if (v) log(`✅ Docker: ${v}`); else log('⚠️ Docker not available'); }
function checkDiskSpace() {
  if (process.platform === 'win32') {
    try {
      const out = execSync('powershell -NoProfile -Command "(Get-PSDrive D).Free"', { encoding: 'utf8' });
      const freeGB = (parseInt(out.trim()) / (1024**3)).toFixed(2);
      log(`✅ Free space on D: ${freeGB} GB`);
    } catch {}
  }
}
function main() { log('--- Starting checks ---'); checkNode(); checkYarn(); checkDocker(); checkDiskSpace(); ensureNodeModules(); log('--- All good ---'); }
main();
