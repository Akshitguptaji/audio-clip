import { createRouter, createWebHistory } from "vue-router";
import LogIn from "../components/LogIn.vue";
import UserRegister from "../components/UserRegister.vue";
import HomePage from "../components/HomePage.vue";
import DashBoard from "../components/DashBoard.vue";

const routes = [
  { path: "/login", component: LogIn },
  { path: "/", component: HomePage },
  { path: "/register", component: UserRegister },
  { path: "/DashBoard", component: DashBoard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");

  if (to.path === "/DashBoard" && !token) {
    return { path: "/login" };
  } else {
    return true;
  }
});

export default router;
