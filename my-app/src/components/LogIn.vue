<template>
  <div class="login-wrapper">
    <!-- Animated Background Shapes -->
    <div class="bg-shape shape1"></div>
    <div class="bg-shape shape2"></div>
    <!-- Glassmorphism Login Card -->
    <div class="glass-container">
      <div class="login-header">
        <div class="logo-circle">
          <i class="fas fa-lock"></i>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to continue your music journey</p>
      </div>
      <form @submit.prevent="Login" class="login-form">
        <!-- Email Input -->
        <div class="input-group">
          <label for="email">Email Address</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope input-icon"></i>
            <input
              v-model="email"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="input-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fas fa-key input-icon"></i>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <!-- Submit Button with Loading State -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Login</span>
          <span v-else class="loader">...</span>
        </button>
      </form>

      <!-- <form @submit.prevent="Login">
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
      <div> -->
      <!-- <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="enter your password"
        />
      </div> -->
      <!-- <div>
        <button type="submit">Login</button>
      </div>
    </form> -->
      <div class="login-footer">
        <p>
          Don't have an account?
          <router-link to="/register" class="link">Sign up</router-link>
        </p>
        <router-link to="/" class="link back-home">← Back to Home</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "LogIn",
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
    };
  },
  mounted() {
    document.title = "ClipForge | Login";
  },
  methods: {
    async Login() {
      this.isLoading = true;
      try {
        const response = await axios.post("http://localhost:8000/api/login", {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          //   this.$router.push("/DashBoard");
          setTimeout(() => {
            this.$router.push("/DashBoard");
          }, 500);
        } else {
          // Agar token nahi mila, toh alert dikhao aur ruko
          alert("Login failed: " + response.data);
          this.isLoading = false;
        }

        //        const token = response.data.token;

        //        console.log("Backend se response:", response.data);
        //      localStorage.setItem("token", token);

        //    this.$router.push("/DashBoard");

        //  console.log("Token stored:", localStorage.getItem("token"));

        // console.log(response);
      } catch (error) {
        this.isLoading = false;
        if (error.response) {
          alert("Error: " + error.response.data);
        } else {
          alert("Server unreachable!");
        }
      }
    },
  },
};
</script>
<style scoped>
/* =========================================
   BASE STYLES
========================================= */
@import url("https://fonts.googleapis.com/css?family=Poppins:wght@300;400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

/* =========================================
   BACKGROUND & LAYOUT
========================================= */
.login-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #050816; /* Dark space theme */
  overflow: hidden;
  margin: 0;
  padding: 20px;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  z-index: 0;
  animation: float 10s infinite ease-in-out;
}

.shape1 {
  width: 400px;
  height: 400px;
  background: #4f46e5;
  top: -100px;
  left: -100px;
}

.shape2 {
  width: 350px;
  height: 350px;
  background: #9333ea;
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

/* =========================================
   GLASSMORPHISM CARD
========================================= */
.glass-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUpFade 0.6s ease-out forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================
   HEADER SECTION
========================================= */
.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px auto;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
}

.logo-circle i {
  font-size: 24px;
  color: white;
}

.login-header h2 {
  font-size: 28px;
  color: white;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.login-header p {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
}

/* =========================================
   FORM ELEMENTS
========================================= */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #cbd5e1;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #64748b;
  font-size: 16px;
  transition: 0.3s;
}

input {
  width: 100%;
  padding: 14px 16px 14px 45px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 15px;
  color: white;
  outline: none;
  transition: all 0.3s ease;
}

input::placeholder {
  color: #475569;
}

input:focus {
  background: rgba(15, 23, 42, 0.8);
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #4f46e5;
}

/* =========================================
   SUBMIT BUTTON
========================================= */
.submit-btn {
  margin-top: 10px;
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.45);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* =========================================
   FOOTER LINKS
========================================= */
.login-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s;
}

.link:hover {
  color: #a5b4fc;
  text-decoration: underline;
}

.back-home {
  font-size: 13px;
  color: #64748b;
}

.back-home:hover {
  color: white;
  text-decoration: none;
}
</style>
