<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import "./assets/style.css";
export default {
  name: "App",
};
</script>

<style scoped>
/* App.vue ki style mein ya main.css mein daal */
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  overflow-x: hidden; /* Horizontal scroll ko rokne ke liye */
}

#app {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  text-align: left; /* Agar text default center ho raha ho toh */
}
</style>
