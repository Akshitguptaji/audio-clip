<template>
  <div class="register-wrapper">
    <!-- Animated Background Shapes -->
    <div class="bg-shape shape1"></div>
    <div class="bg-shape shape2"></div>

    <div class="glass-container">
      <div class="register-header">
        <div class="logo-circle">
          <i class="fas fa-user-plus"></i>
        </div>
        <h2>Create Account</h2>
        <p>Join ClipForge and start your musical journey</p>
      </div>

      <form @submit.prevent="Register" class="register-form">
        <div class="input-group">
          <label>Profile Picture</label>
          <div
            class="input-wrapper"
            style="
              padding: 10px;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 10px;
              border: 1px dashed #7c3aed;
            "
          >
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              style="padding: 5px; border: none; background: transparent"
            />
          </div>
        </div>
        <!-- Username -->
        <div class="input-group">
          <label>Username</label>
          <div class="input-wrapper">
            <i class="fas fa-user input-icon"></i>
            <input
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div class="input-group">
          <label>Email Address</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope input-icon"></i>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div class="input-group">
          <label>Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock input-icon"></i>
            <input
              v-model="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="input-group">
          <label>Confirm Password</label>
          <div class="input-wrapper">
            <i class="fas fa-check-circle input-icon"></i>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="loader">...</span>
        </button>
      </form>
      <div class="footer-links">
        <p>
          Already have an account?
          <router-link to="/login" class="link">Login</router-link>
        </p>
        <router-link to="/" class="link back-home">← Back to Home</router-link>
      </div>
    </div>
    <!-- 
    <form @submit.prevent="Register">
      <label for="username">username</label><br />
      <div>
        <input
          v-model="username"
          type="text"
          id="username"
          name="username"
          placeholder="enter your name"
          required
        /><br />
      </div>

      <label for="email">Email</label><br />
      <div>
        <input
          v-model="email"
          type="email"
          id="email"
          name="email"
          placeholder="enter your email"
          required
        /><br />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="enter your password"
        />
      </div>
      <label for="confirmPassword">Confirm Password</label><br />
      <input
        v-model="confirmPassword"
        type="password"
        id="confirmPassword"
        required
        placeholder="Confirm password"
      /><br />

      <div>
        <button type="submit">Register</button>
      </div>
    </form> -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "UserRegister",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
      profilePicture: null,
    };
  },
  mounted() {
    document.title = "ClipForge | Register";
  },
  methods: {
    handleFileUpload(event) {
      this.profilePicture = event.target.files[0];
    },

    async Register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const formData = new FormData();
      formData.append("username", this.username);
      formData.append("email", this.email);
      formData.append("password", this.password);
      if (this.profilePicture) {
        formData.append("profile_pic", this.profilePicture);
      }
      this.isLoading = true;
      //   try {
      //     await axios.post("http://localhost:8000/api/register", {
      //       username: this.username,
      //       email: this.email,
      //       password: this.password,
      //     });
      //     alert("Registration Successful! Now login.");
      //     this.$router.push("/login");
      //   }

      try {
        await axios.post("http://localhost:8000/api/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Registration Successful!");
        this.$router.push("/login");
      } catch (error) {
        this.isLoading = false;
        alert(
          "registration failed " + (error.response?.data || "Server Error"),
        );
      }
    },
  },
};
</script>
<style scoped>
/* Reuse the same theme styles as Login for consistency */
.register-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #050816;
  overflow-x: hidden;
  padding: 40px 20px;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 10s infinite ease-in-out;
}

.shape1 {
  width: 300px;
  height: 300px;
  background: #7c3aed;
  top: 10%;
  left: 10%;
}
.shape2 {
  width: 300px;
  height: 300px;
  background: #4f46e5;
  bottom: 10%;
  right: 10%;
  animation-delay: 2s;
}

.glass-container {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}
.logo-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-group label {
  color: #cbd5e1;
  font-size: 12px;
  margin-bottom: 5px;
  display: block;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 15px;
  color: #64748b;
}

input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
}

input:focus {
  border-color: #7c3aed;
  outline: none;
  background: rgba(0, 0, 0, 0.5);
}

.submit-btn {
  margin-top: 10px;
  padding: 14px;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.footer-links {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #94a3b8;
}
.link {
  color: #818cf8;
  text-decoration: none;
}
.back-home {
  margin-top: 10px;
  display: block;
  font-size: 12px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
