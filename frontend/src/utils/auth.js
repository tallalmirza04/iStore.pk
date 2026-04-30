export const setAuth = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("token", data.token);
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};