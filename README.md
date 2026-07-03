# 🎵 AudioClip Manager

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

A robust, full-stack web application designed to upload, archive, and manage custom audio clips. This platform empowers users to extract audio directly from YouTube, visualize soundscapes with interactive waveforms, and perform precise audio trimming using cutting-edge FFmpeg integration.

## ✨ Key Features

- **YouTube Audio Extraction:** Seamlessly download and import audio from YouTube URLs using `yt-dlp` and `youtube-dl-exec`.
- **Real-Time Progress Tracking:** Live download and conversion progress bars powered by `Socket.io` websockets.
- **Interactive Waveforms:** Visual audio navigation and drag-to-select regions utilizing `WaveSurfer.js`.
- **Precision Trimming:** Generate and download custom audio snippets on the fly using `FFmpeg`.
- **Secure User Dashboard:** JWT-based authentication for personalized libraries, storage statistics, and profile management.
- **Responsive UI/UX:** Features a sleek, toggleable Dark/Light mode and fluid animations built with Vue 3.

---

## 🛠️ Tech Stack

**Frontend:**

- Vue 3
- Axios
- WaveSurfer.js & Regions Plugin
- Lucide-Vue-Next (Icons)
- Socket.io-client

**Backend:**

- Node.js & Express.js
- MySQL2
- Multer (File Uploads)
- JWT (JSON Web Tokens) & Bcrypt
- FFmpeg (Audio Processing via Child Processes)
- Socket.io

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed on your system:

- Node.js (v16+)
- MySQL
- **FFmpeg**: Must be installed and added to your system's PATH.

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/audio-clip.git](https://github.com/YOUR_GITHUB_USERNAME/audio-clip.git)
cd audio-clip
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# If frontend is in a separate folder (e.g., 'client'), navigate and install:
# cd client && npm install
```

### 3. Database Setup

Create a MySQL database named `lyric` and execute the following SQL commands to set up the tables:

```sql
CREATE DATABASE lyric;
USE lyric;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255)
);

CREATE TABLE clips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    video_url VARCHAR(255),
    start_time FLOAT,
    end_time FLOAT,
    user_id INT,
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. Environment Variables

Create a `.env` file in the root directory of your backend and add your secure keys:

```env
SECRET_KEY=your_super_secret_jwt_key
```

### 5. Run the Application

Start the Node.js backend server:

```bash
node server.js
```

Start the Vue frontend development server (in your frontend directory):

```bash
npm run dev
```

---

## 📂 Folder Structure Setup

Ensure the following directories exist in your backend root to avoid file upload errors. The server will attempt to create them automatically:

- `/uploads`
- `/uploads/music`
- `/uploads/profiles`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
