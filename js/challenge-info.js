async function loadChallengeInfo() {
    const panel = document.getElementById("challenge-details");
    if (!panel) {
        return;
    }

    const getHomePath = () => {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const challengesIndex = segments.indexOf("challenges");

        if (challengesIndex === -1) {
            return "index.html";
        }

        const levelsFromChallenges = segments.length - (challengesIndex + 1);
        const prefix = "../".repeat(Math.max(0, levelsFromChallenges));
        return `${prefix}index.html`;
    };

    const homePath = getHomePath();

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
        const videoUrl = info.videoUrl;

        const versions = Array.isArray(info.versions) ? info.versions : [];
        const currentPath = window.location.pathname;
        const versionOptions = versions
            .filter((version) => version && version.path)
            .map((version) => {
                const resolvedVersionPath = new URL(version.path, window.location.href).pathname;
                const selected = resolvedVersionPath === currentPath ? " selected" : "";
                const label = version.label || version.path;
                return `<option value="${version.path}"${selected}>${label}</option>`;
            })
            .join("");

        const versionsSection =
            versionOptions.length > 1
                ? `
                    <div class="version-picker-wrap">
                        <label for="version-picker">Version</label>
                        <select id="version-picker">${versionOptions}</select>
                    </div>
                `
                : "";

        const videoAction = videoUrl
            ? `<a class="action-link" href="${videoUrl}" target="_blank" rel="noopener noreferrer">Watch Source Video</a>`
            : "";

        panel.innerHTML = `
            <h2>${title}</h2>
            <p class="meta">${date}</p>
            <div class="actions">
                <a class="action-link" href="${homePath}">Back to Home</a>
                ${videoAction}
            </div>
            ${versionsSection}
            <p>${description}</p>
        `;

        const versionPicker = document.getElementById("version-picker");
        if (versionPicker) {
            versionPicker.addEventListener("change", (event) => {
                const nextPath = event.target.value;
                if (nextPath) {
                    window.location.href = nextPath;
                }
            });
        }
    } catch (error) {
        console.error(error);
        panel.innerHTML = `
            <h2>Challenge</h2>
            <div class="actions">
                <a class="action-link" href="${homePath}">Back to Home</a>
            </div>
            <p>Challenge details are temporarily unavailable.</p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadChallengeInfo);
