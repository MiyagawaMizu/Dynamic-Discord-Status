const userID = "906037896295878706"; //put your Discord user id here
const statusImage = document.getElementById("status-image");

async function fetchDiscordStatus() {
	try {
		const response = await axios.get(
			`https://api.lanyard.rest/v1/users/${userID}`
		);
		const { data } = response.data;
		const { discord_status, activities } = data;

		// Get the image path corresponding to the state
		let imagePath;
		switch (discord_status) {
			case "online":
				imagePath = "./status/online.svg";
				break;
			case "idle":
				imagePath = "./status/idle.svg";
				break;
			case "dnd":
				imagePath = "./status/dnd.svg";
				break;
			case "offline":
				imagePath = "./status/offline.svg";
				break;
			default:
				imagePath = "";
				break;
		}

		// Check operation status to update image path
		if (
			activities.find(
				(activity) =>
					activity.type === 1 &&
					(activity.url.includes("twitch.tv") ||
						activity.url.includes("youtube.com"))
			)
		) {
			imagePath = "/public/status/streaming.svg";
		}

		// Update images
		statusImage.src = imagePath;
		statusImage.alt = `Discord Status: ${discord_status}`;
	} catch (error) {
		console.error("Unable to get Discord status:", error);
	}
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 1000); // Update status every 1 seconds
