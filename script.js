// Function to save the bearer token to local storage
function saveBearerToken() {
    const tokenInput = document.getElementById('bearerToken').value;
    if (tokenInput) {
        localStorage.setItem('bearerToken', tokenInput);
        alert('Bearer token saved!');
    } else {
        alert('Please enter a token.');
    }
}

// Function to fetch missions and complete unfinished ones
async function fetchAndCompleteMissions() {
    const token = localStorage.getItem('bearerToken');
    if (!token) {
        alert('Please enter and save your Bearer token first.');
        return;
    }

    const missionData = await fetchMissions(token);
    if (missionData && missionData.success) {
        const missionsDiv = document.getElementById('missions');
        missionsDiv.innerHTML = ''; // Clear previous results

        for (const mission of missionData.data) {
            const missionDiv = document.createElement('div');
            missionDiv.className = 'mission';
            const missionHeader = document.createElement('h4');
            missionHeader.textContent = mission.name;

            if (!mission.completed) {
                const result = await completeMission(token, mission.key);
                missionDiv.classList.add('completed');
                missionHeader.innerHTML += ` <i class="fas fa-check-circle"></i>`;
                const missionReward = document.createElement('p');
                missionReward.textContent = `Mission completed! Reward: ${mission.reward_amount} ${mission.currency}`;
                missionDiv.appendChild(missionReward);
            } else {
                missionHeader.innerHTML += ` <i class="fas fa-times-circle"></i>`;
                const missionCompleted = document.createElement('p');
                missionCompleted.textContent = `Mission already completed.`;
                missionDiv.classList.add('completed');
                missionDiv.appendChild(missionCompleted);
            }

            missionDiv.insertBefore(missionHeader, missionDiv.firstChild);
            missionsDiv.appendChild(missionDiv);
        }
    }
}

// Function to fetch missions
async function fetchMissions(token) {
    const url = "https://miniapp-api.singsing.net/mission?group=main";
    
    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    
    return response.json();
}

// Function to complete a mission
async function completeMission(token, missionKey) {
    const url = "https://miniapp-api.singsing.net/mission/check";
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mission_key: missionKey })
    });

    return response.json();
}

// Event listeners
document.getElementById('saveToken').addEventListener('click', saveBearerToken);
document.getElementById('fetchMissions').addEventListener('click', fetchAndCompleteMissions);
