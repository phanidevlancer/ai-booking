/**
 * Script to copy migrations folder to dist directory
 * This ensures migrations are available in the build output
 */

const fs = require('fs');
const path = require('path');

function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
    console.log(`Created directory: ${destination}`);
  }

  // Read source directory
  const files = fs.readdirSync(source);

  // Copy each file
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    }
  }
}

// Define source and destination paths
const sourceDir = path.resolve(__dirname, '../migrations');
const destDir = path.resolve(__dirname, '../dist/migrations');

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

// Copy migrations directory
console.log(`Copying migrations from ${sourceDir} to ${destDir}`);
copyDirectory(sourceDir, destDir);

console.log('Migration files copied successfully!');