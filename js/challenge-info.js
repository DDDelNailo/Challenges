async function loadChallengeInfo() {
    const panel = document.getElementById("challenge-details");
    if (!panel) {
        return;
    }

    const challengeId = document.body.dataset.challengeId || "?";
    const videoUrl = document.body.dataset.videoUrl;

    try {
        const response = await fetch("info.json");
        if (!response.ok) {
            throw new Error(`Unable to load challenge info: ${response.status}`);
        }

        const info = await response.json();
        const title = info.title || "Challenge";
        const date = info.date || "Unknown date";
        const description =
            info.description ||
            "This challenge explores creative coding concepts using p5.js.";

        const videoAction = videoUrl
            ? `<a class="action-link" href="${videoUrl}" target="_blank">Watch Source Video</a>`
            : "";

        panel.innerHTML = `
            <h2>${title}</h2>
            <p class="meta">Challenge #${challengeId} • ${date}</p>
            <div class="actions">
                <a class="action-link" href="../../index.html">Back to Home</a>
                ${videoAction}
            </div>
            <p>${description}</p>
        `;
    } catch (error) {
        console.error(error);
        panel.innerHTML = `
            <h2>Challenge</h2>
            <p class="meta">Challenge #${challengeId}</p>
            <div class="actions">
                <a class="action-link" href="../../index.html">Back to Home</a>
            </div>
            <p>Challenge details are temporarily unavailable.</p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadChallengeInfo);
