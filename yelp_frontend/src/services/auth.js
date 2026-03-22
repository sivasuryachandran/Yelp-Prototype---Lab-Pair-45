import { authAPI } from "./api";

export const authService = {
  async signup(name, email, password, role = "user") {
    try {
      const response = await authAPI.signup(name, email, password, role);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await authAPI.login(email, password);
      const { access_token, user_id, role } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_id", String(user_id));
      localStorage.setItem("user_role", role);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    window.dispatchEvent(new Event("authChanged"));
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

  getUserId() {
    const raw = localStorage.getItem("user_id");
    return raw ? parseInt(raw, 10) : null;
  },

  getUserRole() {
    return localStorage.getItem("user_role");
  },
};

export default authService;