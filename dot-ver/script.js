const userID = "738748102311280681"; // put ur discord userId here
const statusCircle = document.querySelector(".status-circle");

async function fetchDiscordStatus() {
  try {
    const response = await axios.get(
      `https://api.lanyard.rest/v1/users/${userID}`
    );
    const { data } = response.data;
    const { activities } = data;

    // Check status
    if (activities.find((activity) => activity.type === 1 && activity.url.includes("twitch.tv"))) {
      statusCircle.style.backgroundColor = "#aa8ed6"; // Streaming
    } else if (data.discord_status === "online") {
      statusCircle.style.backgroundColor = "#43B581"; // Online
    } else if (data.discord_status === "idle") {
      statusCircle.style.backgroundColor = "#FAA61A"; // Away/Afk
    } else if (data.discord_status === "dnd") {
      statusCircle.style.backgroundColor = "#F04747"; // Dnd
    } else {
      statusCircle.style.backgroundColor = "#747F8D"; // Invisible/Offline
    }
  } catch (error) {
    console.error("Can't get Discord status:", error);
  }
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 1000); // Update status every 1s (1000ms)
