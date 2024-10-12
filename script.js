const userID = "906037896295878706"; // Đặt Discord user ID của bạn vào đây
const statusImage = document.getElementById("status-image");

// Kết nối WebSocket để nhận trạng thái Discord
function startWebSocket() {
	const ws = new WebSocket("wss://api.lanyard.rest/socket");

	ws.onopen = () => {
		// Gửi yêu cầu để subscribe đến user ID
		ws.send(
			JSON.stringify({
				op: 2, // Subscribe operation
				d: {
					subscribe_to_id: userID,
				},
			})
		);
	};

	ws.onmessage = (event) => {
		const { t, d } = JSON.parse(event.data);
		// Kiểm tra xem có sự kiện "INIT_STATE" hoặc "PRESENCE_UPDATE" hay không
		if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
			updateStatus(d);
		}
	};

	ws.onerror = (error) => {
		console.error("Lỗi WebSocket:", error);
		ws.close();
	};

	ws.onclose = () => {
		console.log("WebSocket đóng, thử kết nối lại...");
		setTimeout(startWebSocket, 1000); // Tự động kết nối lại sau 1 giây nếu WebSocket đóng
	};
}

// Hàm cập nhật hình ảnh trạng thái Discord
function updateStatus(data) {
	const { discord_status, activities } = data;

	// Lấy đường dẫn hình ảnh tương ứng với trạng thái
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

	// Kiểm tra xem người dùng đang stream không
	if (
		activities.find(
			(activity) =>
				activity.type === 1 &&
				(activity.url.includes("twitch.tv") || activity.url.includes("youtube.com"))
		)
	) {
		imagePath = "/public/status/streaming.svg";
	}

	// Cập nhật ảnh trạng thái
	statusImage.src = imagePath;
	statusImage.alt = `Discord Status: ${discord_status}`;
}

// Bắt đầu WebSocket
startWebSocket();
