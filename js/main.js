const container = document.getElementById("challenges");

async function getChallengeList() {
	const response = await fetch("challenges/manifest.json");

	if (!response.ok) {
		throw new Error(`Failed to load manifest: ${response.status}`);
	}

	const data = await response.json();
	if (!Array.isArray(data.challenges)) {
		throw new Error("Invalid manifest format: challenges must be an array");
	}

	return data.challenges;
}

function normalizeChallengeEntry(entry) {
	if (typeof entry === "number" || typeof entry === "string") {
		return {
			path: String(entry),
			entry: "main.html",
			preview: "preview.png",
		};
	}

	if (entry && typeof entry === "object" && typeof entry.path === "string") {
		return {
			path: entry.path,
			entry: entry.entry || "main.html",
			preview: entry.preview || "preview.png",
		};
	}

	throw new Error("Invalid challenge manifest entry");
}


function formatChallengeTitle(path) {
	const segment = path.split("/").pop() || "challenge";
	return segment
		.split(/[_-]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function createChallengeCard({ normalized, title, summary, date, index }) {
	const card = document.createElement("a");
	card.className = "challenge-card";
	card.href = `challenges/${normalized.path}/${normalized.entry}`;
	card.setAttribute("aria-label", `Open challenge: ${title}`);
	card.style.transitionDelay = `${index * 60}ms`;

	card.innerHTML = `
		<img src="challenges/${normalized.path}/${normalized.preview}" alt="${title}" />
		<h2>${title}</h2>
		<p class="summary">${summary}</p>
		<p class="date">${date}</p>
	`;

	return card;
}

async function loadChallenge(entry) {
	const normalized = normalizeChallengeEntry(entry);

	try {
		const response = await fetch(`challenges/${normalized.path}/info.json`);
		if (!response.ok) {
			throw new Error(
				`Failed to load challenge ${normalized.path}: ${response.status}`
			);
		}
		const data = await response.json();

		return {
			normalized,
			title: data.title || formatChallengeTitle(normalized.path),
			summary:
				data.description ||
				"Open this challenge to explore the interactive p5.js sketch.",
			date: data.date || "Unknown date",
		};
	} catch (error) {
		console.error("Error loading challenge:", error);
		return {
			normalized,
			title: formatChallengeTitle(normalized.path),
			summary:
				"Challenge metadata is unavailable right now, but the sketch page can still be opened.",
			date: "Unknown date",
		};
	}
}

async function loadChallenges() {
	if (!container) {
		return;
	}

	try {
		const challengeList = await getChallengeList();
		const challengeData = await Promise.all(
			challengeList.map((entry) => loadChallenge(entry))
		);

		challengeData.forEach((data, index) => {
			const card = createChallengeCard({ ...data, index });
			container.appendChild(card);
			requestAnimationFrame(() => {
				card.classList.add("visible");
			});
		});
	} catch (error) {
		console.error("Error loading challenge list:", error);
	}
}

function isMobile() {
	return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}

function showModal() {
	if (isMobile()) {
		document.getElementById("mobile-warning").style.display = "flex";
	}
}

function closeModal() {
	document.getElementById("mobile-warning").style.display = "none";
}

window.onload = showModal;
loadChallenges();
