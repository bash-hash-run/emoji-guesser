/**
 * Code Slimmer - A utility script to identify large TypeScript/TSX files.
 *
 * This script scans all TypeScript (.ts) and TSX (.tsx) files in the src directory,
 * identifies files with more than 400 lines, and displays them as candidates for refactoring.
 * Large files are often a sign that a component or module is doing too much and should be split
 * into smaller, more focused pieces for better maintainability and readability.
 *
 * Usage: npm run find:chonky-files
 */

const fs = require("fs");
const path = require("path");

// Set the threshold for what's considered a "large" file (in lines)
const LINE_THRESHOLD = 400;

/**
 * Recursively finds all .ts and .tsx files in a directory
 * @param {string} directory - Directory to search
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} List of file paths
 */
function findTsFiles(directory: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);

    // Check if it's a directory
    if (fs.statSync(fullPath).isDirectory()) {
      findTsFiles(fullPath, fileList);
    } else {
      // Check if it's a TypeScript or TSX file
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        // Exclude definition files and test files if needed
        if (!file.endsWith(".d.ts")) {
          fileList.push(fullPath);
        }
      }
    }
  }

  return fileList;
}

/**
 * Counts the number of lines in a file
 * @param {string} filePath - Path to the file
 * @returns {number} Line count
 */
function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, "utf-8");
  return content.split("\n").length;
}

/**
 * Main function to find and display large files
 */
function findLargeFiles(): void {
  const rootDir = path.resolve(__dirname, "../src");

  console.log("🔍 Scanning for large TypeScript files...");
  console.log("");

  try {
    const tsFiles = findTsFiles(rootDir);
    const largeFiles: Array<{ path: string; lines: number }> = [];

    // Count lines for each file
    for (const file of tsFiles) {
      const lineCount = countLines(file);

      if (lineCount > LINE_THRESHOLD) {
        largeFiles.push({
          path: file,
          lines: lineCount,
        });
      }
    }

    // Sort by line count in descending order
    largeFiles.sort((a, b) => b.lines - a.lines);

    // Display results
    if (largeFiles.length === 0) {
      console.log("✅ No large files found! Your codebase is well-organized.");
    } else {
      console.log(
        `🐘 Found ${largeFiles.length} large file(s) that may need refactoring:`,
      );
      console.log("");

      largeFiles.forEach((file, index) => {
        const relativePath = path.relative(process.cwd(), file.path);
        console.log(`${index + 1}. ${relativePath} (${file.lines} lines)`);
      });

      console.log("");
      console.log(
        "💡 Tip: Consider breaking down these files into smaller, more focused components or modules.",
      );
    }
  } catch (error) {
    console.error("❌ Error scanning files:", error);
    process.exit(1);
  }
}

// Run the script
findLargeFiles();
