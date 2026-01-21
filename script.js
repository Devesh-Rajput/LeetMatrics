document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const userInput = document.getElementById("user-input");
    const statContainer = document.querySelector(".stat-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if (!regex.test(username)) {
            alert("Username must be 1–15 characters (letters, numbers, _ or -)");
            return false;
        }
        return true;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) throw new Error("User not found");

            const data = await response.json();
            displayUserData(data);
        } catch (error) {
            statContainer.innerHTML = "<p>No Data Found !!</p>";
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = total === 0 ? 0 : (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {

    const totalQuestions = data.totalQuestions;

    // LeetCode distribution (approx)
    const totalEasy = Math.floor(totalQuestions * 0.4);
    const totalMedium = Math.floor(totalQuestions * 0.4);
    const totalHard = totalQuestions - totalEasy - totalMedium;

    updateProgress(data.easySolved, totalEasy, easyLabel, easyProgressCircle);
    updateProgress(data.mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
    updateProgress(data.hardSolved, totalHard, hardLabel, hardProgressCircle);

    const cardData = [
        { label: "Total Solved", value: data.totalSolved },
        { label: "Easy Solved", value: data.easySolved },
        { label: "Medium Solved", value: data.mediumSolved },
        { label: "Hard Solved", value: data.hardSolved }
    ];

    cardStatsContainer.innerHTML = cardData.map(item => `
        <div class="stats-card">
            <h3>${item.label}</h3>
            <p>${item.value}</p>
        </div>
    `).join("");
}


    searchButton.addEventListener("click", () => {
        const username = userInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
