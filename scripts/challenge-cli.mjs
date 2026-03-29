#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const challengesDir = path.join(rootDir, "challenges");
const manifestPath = path.join(challengesDir, "manifest.json");

function log(msg, type = "info") {
    const colors = {
        info: "\x1b[36m",
        success: "\x1b[32m",
        error: "\x1b[31m",
        warn: "\x1b[33m",
        reset: "\x1b[0m",
    };
    const prefix = colors[type] || colors.info;
    console.log(`${prefix}${msg}${colors.reset}`);
}

function validateChallengeName(name) {
    if (!name || typeof name !== "string") {
        log("Challenge name is required", "error");
        return false;
    }
    if (!/^[a-z0-9_]+$/.test(name)) {
        log(
            "Challenge name must be lowercase alphanumeric with underscores only",
            "error"
        );
        return false;
    }
    return true;
}

function readManifest() {
    try {
        return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch (error) {
        log(`Failed to read manifest: ${error.message}`, "error");
        process.exit(1);
    }
}

function writeManifest(data) {
    try {
        fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2) + "\n");
    } catch (error) {
        log(`Failed to write manifest: ${error.message}`, "error");
        process.exit(1);
    }
}

function addToManifest(challengePath, entry = null) {
    const manifest = readManifest();
    const existingIndex = manifest.challenges.findIndex((c) => c.path === challengePath);

    if (existingIndex === -1) {
        const entry_obj = entry ? { path: challengePath, entry } : { path: challengePath };
        manifest.challenges.push(entry_obj);
        writeManifest(manifest);
        log(`Added "${challengePath}" to manifest`, "success");
    } else if (entry && !manifest.challenges[existingIndex].entry) {
        // Update existing entry to add the entry field
        manifest.challenges[existingIndex].entry = entry;
        writeManifest(manifest);
        log(`Updated "${challengePath}" entry in manifest`, "success");
    }
}

function removeFromManifest(challengePath) {
    const manifest = readManifest();
    const nextChallenges = manifest.challenges.filter((c) => c.path !== challengePath);

    if (nextChallenges.length !== manifest.challenges.length) {
        manifest.challenges = nextChallenges;
        writeManifest(manifest);
        log(`Removed "${challengePath}" from manifest`, "success");
    }
}

function generateHtml(title) {
    return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${title}</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
		<script src="../../../../js/challenge-info.js" defer></script>
		<script src="sketch.js" defer></script>
		<link rel="stylesheet" href="../../../../css/challenges.css" />
	</head>
	<body>
		<main>
			<div id="canvas-container"></div>
			<aside id="challenge-details" aria-live="polite"></aside>
		</main>
	</body>
</html>`;
}

function generateSketch() {
    return `function setup() {
	const canvas = createCanvas(400, 400);
	canvas.parent("canvas-container");
	background(30);
}

function draw() {
	fill(138, 99, 255);
	ellipse(mouseX, mouseY, 50, 50);
}`;
}

function generateInfoJson(title, description, includeVersions = false, versionPaths = []) {
    const info = {
        title,
        date: new Date().toLocaleDateString("en-GB"),
        description,
    };

    if (includeVersions && versionPaths.length > 0) {
        info.versions = versionPaths.map((vPath, i) => ({
            label: `Version ${i + 1}`,
            path: vPath,
        }));
    }

    return JSON.stringify(info, null, "\t");
}

function createNewChallenge(name, title, description) {
    if (!validateChallengeName(name)) {
        process.exit(1);
    }

    const challengePath = path.join(challengesDir, name);

    if (fs.existsSync(challengePath)) {
        log(`Challenge "${name}" already exists`, "error");
        process.exit(1);
    }

    try {
        fs.mkdirSync(challengePath, { recursive: true });

        // Create root info.json
        const infoContent = generateInfoJson(
            title || name.replace(/_/g, " "),
            description ||
            "An interactive p5.js sketch exploring creative coding concepts."
        );
        fs.writeFileSync(path.join(challengePath, "info.json"), infoContent + "\n");

        // Create main.html
        fs.writeFileSync(
            path.join(challengePath, "main.html"),
            generateHtml(title || name.replace(/_/g, " "))
        );

        // Create sketch.js
        fs.writeFileSync(path.join(challengePath, "sketch.js"), generateSketch());

        // Create placeholder preview.png (1x1 transparent PNG)
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
            0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
        ]);
        fs.writeFileSync(path.join(challengePath, "preview.png"), pngBuffer);

        addToManifest(name);

        log(`✓ Created challenge "${name}"`, "success");
        log(`  Location: challenges/${name}/`, "info");
        log(
            `  Edit ${name}/info.json to customize title, date, and description`,
            "info"
        );
    } catch (error) {
        log(`Failed to create challenge: ${error.message}`, "error");
        process.exit(1);
    }
}

function addVersionToChallenge(challengeName, versionLabel = null) {
    if (!validateChallengeName(challengeName)) {
        process.exit(1);
    }

    const challengePath = path.join(challengesDir, challengeName);

    if (!fs.existsSync(challengePath)) {
        log(`Challenge "${challengeName}" not found`, "error");
        process.exit(1);
    }

    const mainHtmlPath = path.join(challengePath, "main.html");
    const sketchJsPath = path.join(challengePath, "sketch.js");
    const infoJsonPath = path.join(challengePath, "info.json");

    // Check if already using versions structure
    const versionsDir = path.join(challengePath, "versions");
    const hasVersions = fs.existsSync(versionsDir);

    try {
        if (!hasVersions) {
            // Convert existing challenge to versions structure
            log(`Converting "${challengeName}" to multi-version structure...`, "warn");

            // Create versions directory
            fs.mkdirSync(versionsDir, { recursive: true });

            // Move existing files to v1
            const v1Dir = path.join(versionsDir, "v1");
            fs.mkdirSync(v1Dir, { recursive: true });

            if (fs.existsSync(mainHtmlPath)) {
                fs.copyFileSync(mainHtmlPath, path.join(v1Dir, "main.html"));
            }
            if (fs.existsSync(sketchJsPath)) {
                fs.copyFileSync(sketchJsPath, path.join(v1Dir, "sketch.js"));
            }

            // Create v1 info.json (copy of root, will add versions array)
            const rootInfo = JSON.parse(fs.readFileSync(infoJsonPath, "utf-8"));
            const v1Info = { ...rootInfo };
            fs.writeFileSync(
                path.join(v1Dir, "info.json"),
                JSON.stringify(v1Info, null, "\t") + "\n"
            );

            // Update root info.json to reference versions
            rootInfo.versions = [{ label: "Version 1", path: "versions/v1/main.html" }];
            fs.writeFileSync(infoJsonPath, JSON.stringify(rootInfo, null, "\t") + "\n");

            // Delete root-level html and sketch files
            if (fs.existsSync(mainHtmlPath)) {
                fs.unlinkSync(mainHtmlPath);
            }
            if (fs.existsSync(sketchJsPath)) {
                fs.unlinkSync(sketchJsPath);
            }

            log(`✓ Converted to versions structure`, "success");
        }

        // Find next available version number
        const existingVersions = fs
            .readdirSync(versionsDir)
            .filter((f) => fs.statSync(path.join(versionsDir, f)).isDirectory());
        const nextVersion = Math.max(...existingVersions.map((v) => parseInt(v.replace("v", "")) || 0)) + 1;
        const versionName = `v${nextVersion}`;
        const versionPath = path.join(versionsDir, versionName);

        // Create new version directory
        fs.mkdirSync(versionPath, { recursive: true });

        // Create version files
        const title = JSON.parse(fs.readFileSync(infoJsonPath, "utf-8")).title || "Challenge";
        fs.writeFileSync(path.join(versionPath, "main.html"), generateHtml(title));
        fs.writeFileSync(path.join(versionPath, "sketch.js"), generateSketch());

        const versionInfo = {
            title,
            date: new Date().toLocaleDateString("en-GB"),
            description: `Alternative implementation${versionLabel ? ` - ${versionLabel}` : ""}.`,
            versions: [
                { label: "Version 1", path: "../v1/main.html" },
                { label: "Version 2", path: "../v2/main.html" },
            ],
        };
        fs.writeFileSync(
            path.join(versionPath, "info.json"),
            JSON.stringify(versionInfo, null, "\t") + "\n"
        );

        // Update root info.json versions array
        const rootInfo = JSON.parse(fs.readFileSync(infoJsonPath, "utf-8"));
        rootInfo.versions = rootInfo.versions || [];
        rootInfo.versions.push({
            label: versionLabel || `Version ${nextVersion}`,
            path: `versions/${versionName}/main.html`,
        });
        fs.writeFileSync(infoJsonPath, JSON.stringify(rootInfo, null, "\t") + "\n");

        // Update manifest to add entry field pointing to v1
        addToManifest(challengeName, "versions/v1/main.html");

        log(`✓ Added version "${versionName}" to challenge "${challengeName}"`, "success");
        log(
            `  Location: challenges/${challengeName}/versions/${versionName}/`,
            "info"
        );
        log(
            `  Edit ${versionName}/sketch.js to implement your changes`,
            "info"
        );
    } catch (error) {
        log(`Failed to add version: ${error.message}`, "error");
        process.exit(1);
    }
}

function deleteChallenge(challengeName) {
    if (!validateChallengeName(challengeName)) {
        process.exit(1);
    }

    const challengePath = path.join(challengesDir, challengeName);

    if (!fs.existsSync(challengePath)) {
        log(`Challenge "${challengeName}" not found`, "error");
        process.exit(1);
    }

    try {
        fs.rmSync(challengePath, { recursive: true, force: true });
        removeFromManifest(challengeName);
        log(`✓ Deleted challenge "${challengeName}"`, "success");
    } catch (error) {
        log(`Failed to delete challenge: ${error.message}`, "error");
        process.exit(1);
    }
}

function printUsage() {
    console.log(`
Challenge CLI - Scaffold new challenges and versions

Usage:
  node scripts/challenge-cli.mjs new <name> [title] [description]
  node scripts/challenge-cli.mjs add-version <challenge> [version-label]
  node scripts/challenge-cli.mjs delete <challenge>

Commands:
  new             Create a new challenge folder with boilerplate files
  add-version     Add a new version to an existing challenge
  delete          Delete a challenge folder and remove it from manifest

Examples:
  node scripts/challenge-cli.mjs new my_sketch "My Sketch" "Description here"
  node scripts/challenge-cli.mjs add-version my_sketch "Alternative approach"
  node scripts/challenge-cli.mjs add-version my_sketch
	node scripts/challenge-cli.mjs delete my_sketch
	`);
}

const args = process.argv.slice(2);

if (args.length === 0) {
    printUsage();
    process.exit(0);
}

const command = args[0];

if (command === "new" && args.length >= 2) {
    const name = args[1];
    const title = args[2] || null;
    const description = args[3] || null;
    createNewChallenge(name, title, description);
} else if (command === "add-version" && args.length >= 2) {
    const challengeName = args[1];
    const versionLabel = args[2] || null;
    addVersionToChallenge(challengeName, versionLabel);

} else if (command === "delete" && args.length >= 2) {
    const challengeName = args[1];
    deleteChallenge(challengeName);
} else {
    log("Invalid command or missing arguments", "error");
    printUsage();
    process.exit(1);
}
