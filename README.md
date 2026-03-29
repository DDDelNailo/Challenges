# Challenges

The Coding Train's Challenges made by me.

Access the challenges [here](https://dddelnailo.github.io/Challenges/).

## Manifest Format

Challenges are listed in [challenges/manifest.json](challenges/manifest.json) using path-based entries:

```json
{
	"challenges": [
		{ "path": "example_challenge", "entry": "versions/v1/main.html" },
		{ "path": "my_custom_challenge" }
	]
}
```

- `path`: challenge folder under `challenges/`
- `entry` (optional): HTML entry page, default is `main.html`
- `preview` (optional): card image file, default is `preview.png`

## Challenge Structure

Each challenge folder should include:

- `info.json` (root metadata used by homepage card)
- `preview.png` (homepage card image)
- Version pages in `versions/vX/`

Recommended layout:

```text
challenges/example_challenge/
	info.json
	preview.png
	versions/
		v1/
			main.html
			sketch.js
			info.json
		v2/
			main.html
			sketch.js
			info.json
```

## Version Metadata

Each version page reads its local `info.json`. Use relative version paths for the dropdown:

```json
{
	"title": "Example Challenge",
	"date": "11/03/2025",
	"description": "...",
	"videoUrl": "https://youtu.be/...",
	"versions": [
		{ "label": "Version 1", "path": "../v1/main.html" },
		{ "label": "Version 2", "path": "../v2/main.html" }
	]
}
```

## Challenge CLI Utility

Use the CLI to quickly scaffold new challenges and add versions:

### Create a New Challenge

```bash
node scripts/challenge-cli.mjs new <name> [title] [description]
```

Example:

```bash
node scripts/challenge-cli.mjs new my_particle_system "Particle System" "Interactive particles with physics"
```

This creates:

- Challenge folder structure
- `info.json`, `main.html`, `sketch.js`, and `preview.png` (placeholder)
- Entry in `challenges/manifest.json`

### Add a Version to a Challenge

```bash
node scripts/challenge-cli.mjs add-version <challenge> [version-label]
```

Examples:

```bash
node scripts/challenge-cli.mjs add-version my_particle_system "Gravity variation"
node scripts/challenge-cli.mjs add-version my_particle_system
```

This:

- Converts single-version challenges to multi-version (moves existing files to `versions/v1/`)
- Creates a new version folder (`versions/vX/`)
- Adds version entry to root `info.json`, enabling the version dropdown
- Generates boilerplate HTML, sketch.js, and info.json files

### Delete a Challenge

```bash
node scripts/challenge-cli.mjs delete <challenge>
```

Example:

```bash
node scripts/challenge-cli.mjs delete my_particle_system
```

This removes the challenge folder and its entry from `challenges/manifest.json`.
```
