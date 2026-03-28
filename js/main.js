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

async function loadChallenge(num) {
	try {
		const response = await fetch(`challenges/${num}/info.json`);
		if (!response.ok) {
			throw new Error(`Failed to load challenge ${num}: ${response.status}`);
		}
		const data = await response.json();

		const card = document.createElement("a");
		card.className = "challenge-card";
		card.href = `challenges/${num}/main.html`;
		card.setAttribute("aria-label", `Open challenge: ${data.title}`);

		card.innerHTML = `
              <img src="challenges/${num}/preview.png" alt="${data.title}" />
              <h2>${data.title}</h2>
              <p class="date">${data.date}</p>
            `;

		container.appendChild(card);
	} catch (error) {
		console.error(`Error loading challenge ${num}:`, error);
	}
}

async function loadChallenges() {
	try {
		const challengeList = await getChallengeList();

		for (let num of challengeList) {
			await loadChallenge(num);
		}
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
