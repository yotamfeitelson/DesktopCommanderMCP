import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function bumpVersion(version, type = 'patch') {
    const [major, minor, patch] = version.split('.').map(Number);
    switch(type) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
        default:
            return `${major}.${minor}.${patch + 1}`;
    }
}

// Read command line arguments
const shouldBump = process.argv.includes('--bump');
const bumpType = process.argv.includes('--major') ? 'major' 
               : process.argv.includes('--minor') ? 'minor' 
               : 'patch';

// Read version from package.json
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
let version = pkg.version;

// Bump version if requested
if (shouldBump) {
    version = bumpVersion(version, bumpType);
    // Update package.json
    pkg.version = version;
    writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
}

// Update version.ts
const versionFileContent = `export const VERSION = '${version}';\n`;
writeFileSync('src/version.ts', versionFileContent);

console.log(`Version ${version} synchronized${shouldBump ? ' and bumped' : ''}`);
