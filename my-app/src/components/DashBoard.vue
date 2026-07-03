<template>
  <div :class="['dashboard', { dark: isDark }]">
    <div class="top-bar">
      <div class="profile-header" v-if="user.profile_pic">
        <img
          :src="'http://localhost:8000/uploads/profiles/' + user.profile_pic"
          class="pfp-img"
        />
        <h1>
          <Music2 :size="30" />
          Welcome User
        </h1>
      </div>
      <div class="top-actions">
        <button @click="isDark = !isDark" class="theme-btn">
          <Moon v-if="!isDark" :size="20" />

          <Sun v-else :size="20" />
        </button>

        <div>
          <button @click="logout">
            <LogOut :size="18" />

            Logout
          </button>
        </div>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-icon">🎵</span>
        <h3>{{ totalSongs }}</h3>
        <p>Total Songs</p>
      </div>

      <div class="stat-card">
        <span class="stat-icon">⏱</span>
        <h3>{{ totalDuration }}</h3>
        <p>Total Clip Time</p>
      </div>

      <div class="stat-card">
        <span class="stat-icon">💾</span>
        <h3>{{ storageUsed }}</h3>
        <p>Storage Used</p>
      </div>

      <div class="stat-card">
        <span class="stat-icon">📥</span>
        <h3>{{ todayImports }}</h3>
        <p>Imported Today</p>
      </div>
    </div>
    <div class="upload-section">
      <!-- File Upload Card -->
      <div class="upload-card">
        <h2><Upload :size="22" /> Upload Audio File</h2>

        <form @submit.prevent="uploadFile" ref="uploadForm">
          <input type="file" @change="handleFileUpload" accept="audio/*" />

          <input type="text" v-model="title" placeholder="Title (Optional)" />

          <div class="time-row">
            <input
              type="number"
              v-model="uploadStart"
              placeholder="Start (sec)"
              min="0"
            />

            <input
              type="number"
              v-model="uploadEnd"
              placeholder="End (sec)"
              min="0"
            />
          </div>

          <div class="button-row">
            <button type="button" @click="previewUpload">Preview</button>

            <button type="submit">
              <Upload :size="18" />

              Upload
            </button>
          </div>
        </form>

        <audio id="preview-audio" controls class="preview-audio"></audio>
      </div>

      <!-- YouTube Card -->
      <div class="upload-card">
        <h2>
          <Youtube :size="22" color="red" />

          Import From YouTube
        </h2>
        <input
          type="text"
          v-model="youtubeUrl"
          placeholder="Paste YouTube URL"
          :disabled="isImporting"
        />

        <input
          type="text"
          v-model="youtubeTitle"
          placeholder="Title (Optional)"
          :disabled="isImporting"
        />

        <button type="button" @click="importYoutube" :disabled="isImporting">
          <Youtube :size="18" />
          {{ isImporting ? "Importing..." : "Import Audio" }}
        </button>

        <div v-if="isImporting" class="download-card">
          <div class="download-header">
            <div class="download-title">
              <span class="spinner"></span>
              <span>Importing Audio...</span>
            </div>
            <span class="download-percent">
              {{ downloadProgress.toFixed(1) }}%
            </span>
          </div>

          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: downloadProgress + '%',
                background:
                  downloadProgress < 30
                    ? '#3b82f6'
                    : downloadProgress < 80
                      ? '#f59e0b'
                      : '#22c55e',
              }"
            ></div>
          </div>

          <div class="download-song">
            <img :src="thumbnail || '/default-cover.png'" class="thumb" />
            <div elseclass="thumb - skeleton"></div>
            <div>
              <h4>🎵 {{ songTitle }}</h4>

              <p>
                {{ downloaded }}

                /

                {{ totalSize }}
              </p>
            </div>
          </div>

          <div class="download-stats">
            <div>⚡ {{ downloadSpeed }}</div>

            <div>⏳ {{ downloadETA }}</div>
          </div>

          <div class="download-time">⏱ {{ elapsed }}</div>

          <p class="download-status">
            {{ downloadStatus }}
          </p>
          <div class="download-info">
            <span>
              {{ downloadProgress < 100 ? "Downloading..." : "Finalizing..." }}
            </span>
            <button
              class="cancel-btn"
              @click="cancelDownload"
              :disabled="downloadProgress >= 100"
            >
              ❌ Cancel Download
            </button>
          </div>
        </div>
        <transition name="fade">
          <div v-if="showSuccess" class="success-message">
            ✔ Audio Imported Successfully
          </div>
        </transition>
        <transition name="fade">
          <div v-if="showCancel" class="cancel-message">
            ❌ {{ cancelMessage }}
          </div>
        </transition>
      </div>
    </div>

    <!-- <div class="download-song">
          <img :src="thumbnail" class="thumb" />

          <div>
            <h4>🎵 {{ songTitle }}</h4>

            <p>
              {{ downloaded }}

              /

              {{ totalSize }}
            </p>
          </div>
        </div>

        <div class="download-stats">
          <div>⚡ {{ downloadSpeed }}</div>

          <div>⏳ {{ downloadETA }}</div>
        </div>
        
        
        akshit
        <div
      style="
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
      "
    >
      <h3>uplaod new music</h3>
      <form @submit.prevent="uploadFile" ref="uploadForm">
        <input type="file" @change="handleFileUpload" accept="audio/*" />
        <div>OR</div>
        <div>
          <input
            type="text"
            v-model="youtubeUrl"
            placeholder="Paste YouTube URL"
          />
        </div>
        <div>
          <input
            type="text"
            v-model="youtubeTitle"
            placeholder="Title (Optional)"
          />
        </div>

        <button type="button" @click="importYoutube">Import Audio</button>
        <div style="margin: 10px 0; display: flex; gap: 10px">
          <div style="margin: 10px 0">
            <input
              type="number"
              v-model="uploadStart"
              placeholder="Start (sec)"
              min="0"
            />
            <input
              type="number"
              v-model="uploadEnd"
              placeholder="End (sec)"
              min="0"
            />
            <input
              type="text"
              v-model="title"
              placeholder="Enter title (optional)"
            />
            <button type="button" @click="previewUpload">Preview Timing</button>
          </div>
           <div>
            <label>Default Start (sec): </label>
            <input
              type="number"
              v-model="uploadStart"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label>Default End (sec): </label>
            <input
              type="number"
              v-model="uploadEnd"
              placeholder="e.g. 30"
              min="0"
            />
          </div> -->

    <!-- <audio
            id="preview-audio"
            controls
            style="display: none; margin-top: 10px"
          ></audio>
        </div>
        <button type="submit" style="display: block; margin-top: 10px">
          Upload music
        </button>
      </form>
    </div> -->

    <div class="clips-section">
      <h2>
        🎵 Your Library

        <span>{{ clips.length }}</span>
      </h2>
      <div class="library-toolbar">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search songs..."
            class="search-input"
          />
        </div>

        <select v-model="sortBy" class="sort-select">
          <option value="newest">Newest</option>

          <option value="oldest">Oldest</option>

          <option value="az">A-Z</option>

          <option value="duration">Longest Clip</option>
        </select>
      </div>

      <div v-if="loading" class="library-loading">
        <div class="loader"></div>

        <h3>Loading Your Library...</h3>
      </div>
      <ul v-else>
        <li
          v-for="(clip, index) in filteredClips"
          :key="clip.id"
          class="clip-card"
        >
          <h3>{{ index + 1 }}. {{ clip.title }}</h3>

          <!-- <strong>your clips {{ clip.title }}</strong> -->

          <br />
          <audio
            class="clip-audio"
            :id="'audio-' + clip.id"
            :src="
              'http://localhost:8000/uploads/music/' +
              clip.video_url.replace(/\\/g, '/')
            "
            type="audio/mpeg"
          >
            Your browser does not support the audio element.
          </audio>

          <div class="waveform-wrapper">
            <div :id="'waveform-' + clip.id" class="waveform-container"></div>
          </div>

          <!-- <button @click="initWaveform(clip)">Load Waveform</button> -->
          <br />

          <form @submit.prevent="saveTimestamps(clip)" class="timestamp-form">
            <div class="timestamp-row">
              <div>
                <label :for="'start-' + clip.id">
                  <Clock3 :size="16" /> start(sec)
                </label>

                <input
                  type="number"
                  v-model="clip.start_time"
                  :id="'start-' + clip.id"
                  required
                />
              </div>

              <div>
                <label :for="'end-' + clip.id"
                  ><Clock3 :size="16" />End (sec):</label
                >
                <input
                  type="number"
                  :id="'end-' + clip.id"
                  v-model="clip.end_time"
                  required
                />
              </div>

              <button type="submit" class="save-btn">
                <Save :size="18" />Save Timestamps
              </button>
              <button
                type="button"
                class="delete-btn"
                @click.stop="deleteClip(clip.id)"
              >
                <Trash2 :size="18" />
                Delete Clip
              </button>

              <button
                type="button"
                class="download-btn"
                @click="downloadSong(clip)"
              >
                <i class="fas fa-download"></i>

                Download Full
              </button>
              <button
                type="button"
                class="download-clip-btn"
                @click="downloadSelectedClip(clip)"
                :disabled="clip.end_time <= clip.start_time"
              >
                <i class="fas fa-scissors"></i>
                Download Clip
              </button>
            </div>
          </form>

          <div class="loop-row">
            <input
              type="checkbox"
              :id="'loop-' + clip.id"
              v-model="clip.is_looping"
            />
            <label :for="'loop-' + clip.id" class="loop-label"
              >Loop Playback</label
            >
          </div>
          <button class="play-btn" @click="playClip(clip)">
            <Play :size="18" />
            {{ clip.isPlaying ? "Pause" : "Play Selection" }}
          </button>
        </li>
      </ul>
      <div v-if="filteredClips.length === 0 && !loading" class="empty-search">
        <i class="fas fa-search"></i>

        <h3>No songs found</h3>

        <p>Try searching with a different title.</p>
      </div>
      <p v-if="clips.length === 0 && !loading">No music uploaded yet.</p>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import {
  LogOut,
  Moon,
  Sun,
  Upload,
  Youtube,
  Play,
  Trash2,
  Save,
  Music2,
  Clock3,
} from "lucide-vue-next";

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import axios from "axios";
// import { registerRuntimeCompiler } from "vue";
export default {
  components: {
    LogOut,
    Moon,
    Sun,
    Upload,
    Youtube,
    Play,
    Trash2,
    Save,
    Music2,
    Clock3,
  },
  name: "DashBoard",
  data() {
    return {
      storageUsed: "0 MB",
      todayImports: 0,
      songTitle: "",
      thumbnail: "",
      duration: 0,
      downloaded: "0 MB",
      totalSize: "",
      elapsed: "0 sec",
      downloadSpeed: "",
      downloadETA: "",
      socket: null,
      socketId: "",
      downloadProgress: 0,
      isImporting: false,
      clips: [],
      loading: false,
      selectedFile: null,
      uploadStart: null,
      uploadEnd: null,
      title: "",
      youtubeUrl: "",
      youtubeTitle: "",
      isDark: false,
      showSuccess: false,
      cancelMessage: "",
      showCancel: false,
      searchQuery: "",
      sortBy: "newest",
      downloadStatus: "Preparing...",
      user: {},
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      const token = localStorage.getItem("token");
      if (!this.selectedFile) {
        alert("Bhai, pehle file toh select kar!");
        return;
      }
      console.log("Dashboard par token mila:", token);
      if (!token) {
        alert("Token nahi mila! Login karo.");
        return;
      }
      //   if (!this.selectedFile) return;

      const formData = new FormData();

      formData.append(
        "start_time",
        this.uploadStart !== null ? this.uploadStart : 0,
      );
      formData.append("end_time", this.uploadEnd !== null ? this.uploadEnd : 0);
      // formData.append("title", this.title || "Untitled");
      formData.append("title", this.title ? this.title.trim() : "");

      formData.append("music", this.selectedFile);
      // formData.append("music", this.selectedFile); // Backend mein 'music' key expect kar raha hai
      // formData.append(
      //   "start_time",
      //   this.uploadStart !== null ? this.uploadStart : 0,
      // );
      // formData.append("end_time", this.uploadEnd !== null ? this.uploadEnd : 0);
      // formData.append("title", this.title || "Untitled");
      // this.loading = true;
      // if (this.selectedFile) {
      //   formData.append("music", this.selectedFile);
      // }
      //   await axios.post(
      //     "http://localhost:8000/api/upload-youtube",
      //     {
      //       youtubeUrl: this.youtubeUrl,
      //       title: this.title,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       },
      //     },
      //   );

      //   if (this.youtubeUrl.trim() !== "") {
      //     formData.append("youtubeUrl", this.youtubeUrl.trim());
      //   }

      //   formData.append("title", this.title);

      //   formData.append("music", this.selectedFile);
      //   formData.append("title", this.title);
      // if (this.uploadStart !== null)
      //   formData.append("start_time", this.uploadStart);
      // if (this.uploadEnd !== null) formData.append("end_time", this.uploadEnd);
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:8000/api/upload-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        this.$refs.uploadForm.reset();
        this.selectedFile = null;
        this.uploadStart = null;
        this.uploadEnd = null;
        this.title = "";
        this.fetchClips();
        document.getElementById("preview-audio").style.display = "none";

        const audio = document.getElementById("preview-audio");
        if (audio.src) URL.revokeObjectURL(audio.src);
        audio.style.display = "none";

        alert("Upload Successful!");
      } catch (error) {
        alert(
          "Upload Failed ho gya bhai : " +
            (error.response?.data || "Server Error"),
        );
      }
    },
    async fetchClips() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/clips", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.clips = response.data.map((clip) => ({
          ...clip,
          isPlaying: false,
        }));

        let totalBytes = 0;

        this.clips.forEach((clip) => {
          if (clip.file_size) {
            totalBytes += clip.file_size;
          }
        });

        this.storageUsed = (totalBytes / (1024 * 1024)).toFixed(2) + " MB";
        const today = new Date().toISOString().split("T")[0];

        this.todayImports = this.clips.filter((clip) => {
          if (!clip.created_at) return false;

          return clip.created_at.startsWith(today);
        }).length;
        this.$nextTick(() => {
          this.clips.forEach((clip) => this.initWaveform(clip));
        });
      } catch (error) {
        console.error("Failed to load clips:", error);
      } finally {
        this.loading = false;
      }
    },

    async saveTimestamps(clip) {
      try {
        await axios.post(
          `http://localhost:8000/api/clips/${clip.id}`,
          {
            start: clip.start_time,
            end: clip.end_time,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (clip.region) {
          clip.region.setOptions({
            start: clip.start_time,
            end: clip.end_time,
          });
        }
      } catch (err) {
        alert("error aagya");
      }
    },
    async playClip(clip) {
      //   console.log("Play button clicked");

      const audio = document.getElementById("audio-" + clip.id);
      if (!audio) {
        alert("Audio element nahi mila!");
        return;
      }
      audio.onplay = () => {
        clip.isPlaying = true;
      };
      audio.onpause = () => {
        clip.isPlaying = false;
      };
      if (!audio.paused) {
        audio.pause();
        clip.isPlaying = false;

        if (clip._timeHandler) {
          audio.removeEventListener("timeupdate", clip._timeHandler);
          clip._timeHandler = null;
        }

        return;
      }

      audio.currentTime = clip.start_time || 0;

      try {
        await audio.play();
        clip.isPlaying = true;
      } catch (err) {
        console.log("erro");
      }
      if (clip._timeHandler) {
        audio.removeEventListener("timeupdate", clip._timeHandler);
      }

      //   audio.pause();

      //   clip.isPlaying = false;
      //   audio.currentTime = clip.start_time || 0;
      //   if (clip.wavesurfer) {
      //     clip.wavesurfer.setTime(audio.currentTime);
      //   }
      //   audio
      //     .play()
      //     .then(() => console.log("Playing"))
      //     .catch((err) => console.error(err));
      //   //   if (clip._timeHandler) {
      //     audio.removeEventListener("timeupdate", clip._timeHandler);
      //   }

      clip._timeHandler = function checkTime() {
        // if (clip.wavesurfer) {
        //   clip.wavesurfer.setTime(audio.currentTime);
        // }

        if (clip.end_time != null && audio.currentTime >= clip.end_time) {
          if (clip.is_looping) {
            audio.currentTime = clip.start_time || 0;
            // if (clip.wavesurfer) {
            //   clip.wavesurfer.setTime(audio.currentTime);
            // }
            audio.play();
          } else {
            audio.pause();
            audio.currentTime = clip.start_time || 0;
            // if (clip.wavesurfer) {
            //   clip.wavesurfer.setTime(audio.currentTime);
            // }
            clip.isPlaying = false;
            audio.removeEventListener("timeupdate", clip._timeHandler);

            clip._timeHandler = null;
          }
        }
      };
      audio.addEventListener("timeupdate", clip._timeHandler);
    },
    previewUpload() {
      if (!this.selectedFile) {
        alert("Pehle file select karo!");
        return;
      }
      const audio = document.getElementById("preview-audio");

      audio.src = URL.createObjectURL(this.selectedFile);
      audio.style.display = "block";
      audio.currentTime = this.uploadStart || 0;
      audio.play();

      audio.ontimeupdate = () => {
        if (this.uploadEnd && audio.currentTime >= this.uploadEnd) {
          audio.pause();
          audio.currentTime = this.uploadStart || 0;
        }
      };
    },
    initWaveform(clip) {
      console.log("Init waveform:", clip.id);
      if (clip.wavesurfer) {
        if (clip.region) {
          clip.region.remove();

          clip.region = null;
        }
        clip.wavesurfer.destroy();

        clip.wavesurfer = null;
      }

      const containerId = "waveform-" + clip.id;
      const container = document.getElementById(containerId);
      const audio = document.getElementById("audio-" + clip.id);
      console.log(container);
      if (!container) {
        console.log("Container nahi mila:", containerId);
        return;
      }
      if (!audio) {
        console.log("Audio element nahi mila");
        return;
      }
      if (!container || !audio) {
        console.log("Container ya Audio tag nahi mila for clip:", clip.id);
        return;
      }
      // audio.load();
      // console.log("readyState:", audio.readyState);
      // console.log("currentSrc:", audio.currentSrc);
      // console.log("src:", audio.src);
      // console.log(audio);
      // console.log(audio.outerHTML);
      // console.log(clip.video_url);
      //   audio.onloadedmetadata = () => {
      //     const ws = WaveSurfer.create({
      //       container: container,
      //       waveColor: "#A5B4FC", // Light color unplayed part ke liye
      //       progressColor: "#4F46E5", // Dark prominent color jo progress dikhayega,
      //       media: audio,
      //       fillParent: true,
      //       responsive: true,
      //     });

      //     clip.wavesurfer = ws;

      //     // ws.on("ready", () => {
      //     //   console.log("WaveSurfer Ready:", clip.id);
      //     const regions = ws.registerPlugin(RegionsPlugin.create());
      //     ws.on("ready", () => {
      //       const region = regions.addRegion({
      //         start: clip.start_time || 0,
      //         end: clip.end_time || 10,
      //         color: "rgba(16, 185, 129, 0.2)",
      //         drag: true,
      //         resize: true,
      //       });

      //       clip.region = region;
      //       //   clip.wavesurfer = ws;
      //       region.on("update", () => {
      //         // console.log(region.start, region.end);
      //         clip.start_time = +region.start.toFixed(2);
      //         clip.end_time = +region.end.toFixed(2);
      //       });
      //       region.on("update-end", () => {
      //         clip.start_time = Number(region.start.toFixed(2));
      //         clip.end_time = Number(region.end.toFixed(2));
      //       });

      //       // audio.addEventListener("play", () => {
      //       //   clip.isPlaying = true;
      //       // });

      //       // audio.addEventListener("pause", () => {
      //       //   clip.isPlaying = false;
      //       // });
      //     });
      //     ws.on("error", (err) => {
      //       console.error("WaveSurfer Error:", err);
      //     });
      //   };
      if (clip.wavesurfer) {
        if (clip.region) {
          clip.region.remove();
          clip.region = null;
        }
        clip.wavesurfer.destroy();
        clip.wavesurfer = null;
      }
      const createWaveform = () => {
        const ws = WaveSurfer.create({
          container: container,
          waveColor: "#A5B4FC",
          progressColor: "#4F46E5",
          media: audio,
          fillParent: true,
          responsive: true,
        });

        clip.wavesurfer = ws;

        const regions = ws.registerPlugin(RegionsPlugin.create());
        regions.enableDragSelection({
          color: "rgba(16, 185, 129, 0.2)",
        });
        ws.on("decode", () => {
          // const region = regions.addRegion({
          //   start: clip.start_time || 0,
          //   end: clip.end_time || 10,
          //   color: "rgba(16,185,129,.2)",
          //   drag: true,
          //   resize: true,
          regions.clearRegions();

          const region = regions.addRegion({
            start: clip.start_time || 0,
            end: clip.end_time || 10, // Agar end_time nahi hai toh default 10 seconds
            color: "rgba(16, 185, 129, 0.2)",
            drag: true,
            resize: true,
          });

          clip.region = region;

          region.on("update", () => {
            clip.start_time = +region.start.toFixed(2);
            clip.end_time = +region.end.toFixed(2);
          });
        });

        regions.on("region-created", (region) => {
          // Agar screen par ek se zyada selection ban jayein, toh purana wala hata do
          const allRegions = regions.getRegions();
          if (allRegions.length > 1) {
            allRegions[0].remove();
          }

          clip.region = region;

          region.on("update", () => {
            clip.start_time = Number(region.start.toFixed(2));
            clip.end_time = Number(region.end.toFixed(2));
          });
        });
      };
      if (audio.readyState >= 1) {
        createWaveform();
      } else {
        audio.onloadedmetadata = createWaveform;
      }
    },

    // getButtonText(clip) {
    //   const audio = document.getElementById("audio-" + clip.id);

    //   if (!audio) return "Play Selection";

    //   return audio.paused ? "Play Selection" : "Pause";
    // },

    async deleteClip(id) {
      if (!confirm("Delete this clip?")) return;

      try {
        const token = localStorage.getItem("token");
        console.log("DELETE TOKEN:", token);
        await axios.delete(`http://localhost:8000/api/clips/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Clip Deleted");

        this.fetchClips();
      } catch (err) {
        alert("Delete Failed");
        console.error(err);
      }
    },

    async importYoutube() {
      const token = localStorage.getItem("token");

      if (!this.youtubeUrl.trim()) {
        alert("Paste a YouTube URL.");
        return;
      }
      this.isImporting = true;

      this.downloadProgress = 0;
      try {
        const response = await axios.post(
          "http://localhost:8000/api/upload-youtube",

          {
            youtubeUrl: this.youtubeUrl,
            title: this.youtubeTitle,
            socketId: this.socketId,
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // alert(response.data.message);

        this.youtubeUrl = "";
        this.youtubeTitle = "";
        this.title = "";
        this.downloadStatus = "Saving to Library...";
        await this.fetchClips();
        this.downloadStatus = "Completed";

        this.showSuccess = true;
        this.downloadProgress = 100;

        setTimeout(() => {
          this.downloadProgress = 0;
        }, 1000);
        this.showSuccess = true;

        setTimeout(() => {
          this.showSuccess = false;
        }, 1000);

        setTimeout(() => {
          this.songTitle = "";
          this.thumbnail = "";
          this.downloaded = "0 MB";
          this.totalSize = "";
          this.downloadETA = "";
          this.downloadSpeed = "";
          this.elapsed = "0 sec";
        }, 2000);
      } catch (err) {
        console.error(err);

        alert(err.response?.data?.message || "Import Failed");
      } finally {
        this.isImporting = false;
      }
    },
    cancelDownload() {
      this.socket.emit("cancelDownload", {
        socketId: this.socketId,
      });
    },

    async downloadSong(clip) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:8000/api/download/${clip.id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            responseType: "blob",
          },
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");

        link.href = url;

        link.download = clip.title + ".mp3";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.log(err);

        alert("Download Failed");
      }
    },

    async downloadSelectedClip(clip) {
      try {
        const token = localStorage.getItem("token");

        // const response = await axios.get(
        //   `http://localhost:8000/api/download-clip/${clip.id}`,

        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },

        //     responseType: "blob",
        //   },
        // );

        const response = await axios.post(
          `http://localhost:8000/api/download-clip/${clip.id}`,

          {
            start: clip.start_time,
            end: clip.end_time,
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          },
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");

        link.href = url;

        link.download = clip.title + "_clip.mp3";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.log(err);

        alert("Clip Download Failed");
      }
    },
  },

  computed: {
    totalSongs() {
      return this.clips.length;
    },

    totalDuration() {
      let total = 0;

      this.clips.forEach((clip) => {
        const start = parseFloat(clip.start_time) || 0;
        const end = parseFloat(clip.end_time) || 0;

        if (end > start) {
          total += end - start;
        }
      });

      const minutes = Math.floor(total / 60);
      const seconds = Math.floor(total % 60);

      return `${minutes}m ${seconds}s`;
    },
    filteredClips() {
      let filtered = [...this.clips];

      // Search
      if (this.searchQuery.trim()) {
        filtered = filtered.filter((clip) =>
          clip.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
        );
      }

      // Sort
      switch (this.sortBy) {
        case "newest":
          filtered.sort((a, b) => b.id - a.id);
          break;

        case "oldest":
          filtered.sort((a, b) => a.id - b.id);
          break;

        case "az":
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;

        case "duration":
          filtered.sort(
            (a, b) => b.end_time - b.start_time - (a.end_time - a.start_time),
          );
          break;
      }

      return filtered;
    },
  },
  async mounted() {
    const token = localStorage.getItem("token");
    console.log("noob");

    try {
      const res = await axios.get("http://localhost:8000/api/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.user = res.data;
      console.log("Profile data:", res.data); // Console mein check kar lena pfp aa rahi hai ya nahi
    } catch (error) {
      console.error("Profile pic load nahi hui:", error);
    }
    // const res = await axios.get("http://localhost:8000/api/user-profile", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // this.user = res.data;

    // console.log(res.data);

    this.fetchClips();
    this.isDark = localStorage.getItem("theme") == "dark";
    this.socket = io("http://localhost:8000");
    this.socket.on("connect", () => {
      console.log("Socket Connected");
      this.socketId = this.socket.id;

      console.log("Socket ID:", this.socketId);
      this.socket.emit("ping");
    });
    this.socket.on("downloadProgress", (data) => {
      this.downloadProgress = data.progress;

      if (data.progress < 100) {
        this.downloadStatus = "Downloading Audio...";
      } else {
        this.downloadStatus = "Converting to MP3...";
      }

      this.downloadSpeed = data.speed;
      this.downloadETA = data.eta;
      this.downloaded = data.downloaded;
      this.totalSize = data.total;

      this.elapsed = data.elapsed;

      console.log("Download:", this.downloadProgress);
    });
    this.socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
    this.socket.on("downloadStart", (data) => {
      this.songTitle = data.title;
      this.thumbnail = data.thumbnail;
      this.duration = data.duration;
      //   this.elapsed = data.elapsed;
    });

    this.socket.on("downloadCancelled", () => {
      this.isImporting = false;

      this.downloadProgress = 0;
      this.songTitle = "";
      this.thumbnail = "";
      this.downloaded = "0 MB";
      this.totalSize = "";
      this.downloadETA = "";
      this.downloadSpeed = "";
      this.elapsed = "0 sec";

      this.showCancel = true;
      this.cancelMessage = "Download Cancelled";

      setTimeout(() => {
        this.showCancel = false;
      }, 2000);
    });
    this.socket.on("downloadComplete", (data) => {
      this.downloadStatus = "Completed";

      console.log(data.title);
    });
  },

  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },

  watch: {
    isDark(val) {
      localStorage.setItem("theme", val ? "dark" : "light");
    },
    filteredClips() {
      this.$nextTick(() => {
        this.filteredClips.forEach((clip) => {
          this.initWaveform(clip);
        });
      });
    },
  },
};
</script>

<style>
.stats-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

  gap: 20px;

  margin: 30px 0;
}

.search-box {
  position: relative;

  flex: 1;

  min-width: 260px;
}

.search-icon {
  position: absolute;

  left: 16px;

  top: 50%;

  transform: translateY(-50%);

  color: #94a3b8;

  font-size: 16px;

  transition: 0.3s;

  pointer-events: none;
}
.empty-search {
  text-align: center;

  padding: 50px 20px;

  color: #64748b;
}

.empty-search i {
  font-size: 50px;

  margin-bottom: 15px;

  color: #cbd5e1;
}

.empty-search h3 {
  margin-bottom: 8px;

  font-size: 22px;
}
.search-input {
  width: 100%;

  padding: 12px 18px 12px 45px;

  border-radius: 12px;

  border: 1px solid #d1d5db;

  font-size: 15px;

  transition: all 0.3s ease;

  outline: none;

  background: white;
}

.search-input:focus {
  border-color: #3b82f6;

  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.search-box:focus-within .search-icon {
  color: #2563eb;

  transform: translateY(-50%) scale(1.15);
}
.stat-card {
  background: white;

  padding: 25px;

  border-radius: 16px;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);

  text-align: center;

  transition: 0.3s;

  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 32px;

  display: block;

  margin-bottom: 10px;
}

.stat-card h3 {
  font-size: 28px;

  margin: 5px 0;

  color: #2563eb;
}

.stat-card p {
  color: #64748b;

  font-size: 15px;

  margin: 0;
}
.preview-audio {
  display: none;
  margin-top: 15px;
  width: 100%;
}

.preview-audio.show {
  display: block;
}
.upload-section {
  display: flex;

  gap: 25px;

  margin: 30px 0;

  flex-wrap: wrap;
}

.upload-card {
  flex: 1;

  min-width: 350px;

  background: #fff;

  padding: 20px;

  border-radius: 12px;

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.upload-card h2 {
  margin-bottom: 20px;
}

.upload-card input {
  width: 100%;

  padding: 10px;

  margin-bottom: 15px;

  border: 1px solid #ddd;

  border-radius: 8px;

  box-sizing: border-box;
}

.time-row {
  display: flex;

  gap: 10px;
}

.time-row input {
  flex: 1;
}

.button-row {
  display: flex;

  gap: 10px;
}

.upload-card button {
  padding: 10px 20px;

  border: none;

  border-radius: 8px;

  cursor: pointer;
}

button {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;
}

h2 {
  display: flex;

  align-items: center;

  gap: 10px;
}

h1 {
  display: flex;

  align-items: center;

  gap: 12px;
}
.download-card {
  margin-top: 20px;

  padding: 18px;

  border-radius: 12px;

  background: #f8fafc;

  border: 1px solid #e2e8f0;

  animation: fadeIn 0.3s;
}

.dashboard.dark .search-input {
  background: #1f2937;

  color: white;

  border: 1px solid #374151;
}

.dashboard.dark .search-icon {
  color: #9ca3af;
}

.dashboard.dark .search-box:focus-within .search-icon {
  color: #60a5fa;
}

.clip-card {
  animation: fadeUp 0.35s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;

    transform: translateY(10px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}
.download-header {
  display: flex;

  justify-content: space-between;

  font-weight: 600;

  margin-bottom: 12px;
}

.progress-bar {
  height: 12px;

  background: #e5e7eb;

  border-radius: 30px;

  overflow: hidden;
}

.progress-fill {
  height: 100%;
  /* 
  background: linear-gradient(90deg, #6366f1, #3b82f6); */

  transition:
    width 0.35s ease,
    background 0.3s ease;
}

.download-card p {
  margin-top: 10px;

  font-size: 14px;

  color: #64748b;
}
.library-toolbar {
  display: flex;

  justify-content: space-between;

  gap: 20px;

  margin: 20px 0;

  flex-wrap: wrap;
}

.search-input {
  flex: 1;

  min-width: 250px;

  padding: 12px 16px;

  border-radius: 10px;

  border: 1px solid #d1d5db;

  font-size: 15px;
}

.sort-select {
  padding: 12px;

  border-radius: 10px;

  border: 1px solid #d1d5db;

  cursor: pointer;
}

.empty-search {
  text-align: center;

  margin: 40px 0;

  font-size: 18px;

  color: #64748b;
}
.download-btn {
  background: #2563eb;

  color: white;

  padding: 10px 18px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  transition: 0.3s;

  display: flex;

  align-items: center;

  gap: 8px;
}

.download-btn:hover {
  background: #1d4ed8;

  transform: translateY(-2px);
}
.dashboard.dark .search-input,
.dashboard.dark .sort-select {
  background: #374151;

  color: white;

  border: 1px solid #4b5563;
}
@keyframes fadeIn {
  from {
    opacity: 0;

    transform: translateY(10px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}
button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}
.upload-card {
  transition: 0.3s;
}

.upload-card:hover {
  transform: translateY(-5px);

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}
.clip-card {
  animation: slideIn 0.35s ease;
}
.download-clip-btn:disabled {
  opacity: 0.5;

  cursor: not-allowed;

  transform: none;
}
@keyframes slide {
  from {
    opacity: 0;

    transform: translateY(20px);
  }

  to {
    opacity: 1;

    transform: none;
  }
}
.success-message {
  margin-top: 20px;

  padding: 15px;

  border-radius: 10px;

  background: #dcfce7;

  color: #15803d;

  font-weight: 600;

  text-align: center;

  animation: pop 0.4s;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  transform: translateY(10px);
}
.download-song {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-top: 18px;
}

.thumb {
  width: 70px;

  height: 70px;

  border-radius: 12px;

  object-fit: cover;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.download-status {
  margin-top: 15px;

  font-weight: 600;

  color: #475569;

  text-align: center;

  font-size: 15px;
}
@keyframes pop {
  0% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
}

.cancel-message {
  margin-top: 15px;
  padding: 15px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
}
/* DashBoard.vue ke style tag mein add karo */
/* Pure waveform container ka outer wrapper */
.waveform-wrapper {
  width: 100%;
  max-width: 100%; /* Boundary set karne ke liye */
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px;
  box-sizing: border-box;
  margin: 15px 0;
  overflow: hidden;
}

.waveform-container {
  width: 100% !important;
  height: 100px;
  position: relative;
}

.clips-section {
  margin-top: 40px;
}

.clip-card {
  list-style: none;
  background: white;
  padding: 20px;
  margin-bottom: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.clip-card h3 {
  margin-bottom: 15px;
}

.clip-audio {
  width: 100%;
  margin: 15px 0;
}

.timestamp-form {
  margin-top: 20px;
}

.timestamp-row {
  display: flex;
  gap: 15px;
  align-items: end;
  flex-wrap: wrap;
}

.timestamp-row div {
  display: flex;
  flex-direction: column;
}

.timestamp-row input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.loop-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 15px 0;
}

.loop-label {
  cursor: pointer;
  user-select: none;
}

.save-btn,
.delete-btn,
.play-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background: #4f46e5;
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.play-btn {
  background: #10b981;
  color: white;
}

.save-btn:hover {
  background: #4338ca;
}

.delete-btn:hover {
  background: #dc2626;
}

.play-btn:hover {
  background: #059669;
}
.clip-audio {
  width: 100%;
}

.waveform-wrapper {
  width: 100%;
  overflow-x: auto;
}

.waveform-container {
  width: 100%;
  min-height: 90px;
}
.upload-section {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.dashboard {
  min-height: 100vh;
  padding: 25px;
  background: #f5f7fb;
  color: #222;
  transition: 0.3s;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.top-actions {
  display: flex;
  gap: 10px;
}

.top-actions button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.upload-card,
.clip-card {
  background: white;
  transition: 0.3s;
}
.dashboard.dark {
  background: #111827;
  color: white;
}

.dashboard.dark .stat-card {
  background: #1f2937;
}
.dashboard.dark .upload-card,
.dashboard.dark .clip-card {
  background: #1f2937;
  color: white;
}

.dashboard.dark input {
  background: #374151;
  color: white;
  border: 1px solid #4b5563;
}

.dashboard.dark input::placeholder {
  color: #cbd5e1;
}

.dashboard.dark button {
  color: white;
}

.dashboard.dark audio {
  filter: invert(0.92);
}

.dashboard.dark .waveform-wrapper {
  background: #111827;
}
.theme-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 20px;
}
.download-card {
  margin-top: 18px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.35s ease;
}

.download-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.download-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #1f2937;
}

.download-percent {
  font-weight: 700;
  color: #2563eb;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #06b6d4);
  transition: width 0.25s linear;
}

.download-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.library-loading {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 50px 20px;

  color: #64748b;
}

.loader {
  width: 45px;

  height: 45px;

  border: 5px solid #dbeafe;

  border-top: 5px solid #2563eb;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.pfp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.download-clip-btn {
  background: #16a34a;

  color: white;

  padding: 10px 16px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  transition: 0.3s;

  display: flex;

  align-items: center;

  gap: 8px;
}

.download-clip-btn:hover {
  background: #15803d;

  transform: translateY(-2px);
}

/* =========================================
   LIGHT MODE (DEFAULT) TEXT FIXES 
========================================= */
/* Main container aur cards ka text dark (black/grey) rahega */
.dashboard {
  color: #1f2937;
}

.dashboard h1,
.dashboard h2,
.dashboard h3,
.dashboard p,
.dashboard label {
  color: #1f2937; /* Dark Grey Text for Light BG */
}

/* Inputs aur Search boxes ka text bhi dark rahega */
.dashboard input,
.dashboard select {
  color: #111827;
  background-color: #ffffff;
}

/* Cards ka background white aur text dark */
.dashboard .upload-card,
.dashboard .clip-card,
.dashboard .stat-card {
  background: #ffffff;
  color: #1f2937;
}

/* =========================================
   DARK MODE TEXT OVERRIDES 
========================================= */
/* Jab .dark class active ho, toh text light (white/grey) ho jayega */
.dashboard.dark h1,
.dashboard.dark h2,
.dashboard.dark h3,
.dashboard.dark p,
.dashboard.dark label {
  color: #f9fafb; /* White Text for Dark BG */
}

.dashboard.dark input,
.dashboard.dark select {
  color: #ffffff; /* White text inside inputs */
  background: #374151; /* Dark grey input background */
}

.dashboard.dark .upload-card,
.dashboard.dark .clip-card,
.dashboard.dark .stat-card {
  background: #112937;
  color: #f9fafb;
}
/* ============================= */
/* Responsive Design */
/* ============================= */
@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .top-actions {
    width: 100%;
  }

  .top-actions button {
    flex: 1;
  }
}
@media (max-width: 768px) {
  .upload-section {
    flex-direction: column;
    gap: 20px;
  }

  .upload-card {
    min-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .time-row {
    flex-direction: column;
    gap: 10px;
  }

  .button-row {
    flex-direction: column;
  }

  .button-row button {
    width: 100%;
  }

  .timestamp-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .timestamp-row div {
    width: 100%;
  }

  .timestamp-row input {
    width: 100%;
    box-sizing: border-box;
  }

  .save-btn,
  .delete-btn,
  .play-btn {
    width: 100%;
  }

  .clip-card h3 {
    font-size: 18px;
    word-break: break-word;
  }

  .clip-audio {
    width: 100%;
  }

  .waveform-container {
    width: 100%;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .upload-card {
    padding: 15px;
  }

  .clip-card {
    padding: 15px;
  }

  .upload-card h2,
  .clips-section h2 {
    font-size: 20px;
  }

  .clip-card h3 {
    font-size: 16px;
  }

  input,
  button {
    font-size: 15px;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;

    transform: translateY(25px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}
</style>
