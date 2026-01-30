import CryptoJS from "crypto-js";

const SECRET_KEY = "fdf4-832b-b4fd-ccfb9258a6b3";

export const encryptPassword = (password) =>
  CryptoJS.AES.encrypt(password, SECRET_KEY).toString();


export const mapUserFromApi = (api) => ({
  id: api.id,
  role: api.role,
  name: api.name,
  email: api.email,
});

export const mapUsersFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapUserFromApi);
};

export const mapUserToApi = (ui) => ({
  role: ui.role,
  name: ui.fullName,
  email: ui.email,
  password: ui.password
});
