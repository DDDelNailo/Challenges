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
