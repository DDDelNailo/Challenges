async function loadChallengeInfo() {
    const panel = document.getElementById("challenge-details");
    if (!panel) {
        return;
    }

    const fetchJson = async (path) => {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Unable to load ${path}: ${response.status}`);
        }

        return response.json();
    };

    const getSharedInfoPath = () => {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const versionsIndex = segments.indexOf("versions");

        if (versionsIndex === -1) {
            return null;
        }

        const levelsToChallengeRoot = segments.length - versionsIndex - 1;
        return `${"../".repeat(Math.max(0, levelsToChallengeRoot))}info.json`;
    };

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
        const localInfo = await fetchJson("info.json");
        const sharedInfoPath = getSharedInfoPath();

        let sharedInfo = null;
        if (sharedInfoPath) {
            try {
                sharedInfo = await fetchJson(sharedInfoPath);
            } catch (sharedInfoError) {
                console.warn(sharedInfoError);
            }
        }

        const info = localInfo;
        const title = info.title || "Challenge";
        const date = info.date || "Unknown date";
        const description =
            info.description ||
            "This challenge explores creative coding concepts using p5.js.";
        const videoUrl = info.videoUrl;

        const versionsSource =
            Array.isArray(sharedInfo?.versions) && sharedInfo.versions.length > 0
                ? sharedInfo.versions
                : Array.isArray(localInfo.versions)
                    ? localInfo.versions
                    : [];

        const versionsBaseHref = sharedInfoPath
            ? new URL(sharedInfoPath, window.location.href).href
            : window.location.href;

        const currentPath = window.location.pathname;
        const versionOptions = versionsSource
            .filter((version) => version && version.path)
            .map((version) => {
                const resolvedVersionPath = new URL(version.path, versionsBaseHref).pathname;
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
                const relativePath = event.target.value;
                if (relativePath) {
                    const targetUrl = new URL(relativePath, window.location.href);
                    window.location.href = targetUrl.href;
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
