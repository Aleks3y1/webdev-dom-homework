const apiURL = "https://wedev-api.sky.pro/api/v2/aleksey-e/comments";
const userURL = "https://wedev-api.sky.pro/api/user/login";

export let token;

export const setToken = (newToken) => {
  token = newToken;
};

export function getTodos() {
  return fetch(apiURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Сервер сломался. Попробуйте позже.");
    } else if (response.status === 200) {
      return response.json();
    } else if (!window.navigator.onLine) {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
  });
}

export function postComment(token, text, name) {
  return fetch(apiURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: text.value,
      name: name.value,
      forceError: true,
    }),
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Сервер сломался. Попробуйте позже.");
    } else if (response.status === 400) {
      throw new Error("Имя и комментарий должны быть не короче 3 символов");
    } else if (response.status === 201) {
      return response.json();
    } else if (!window.navigator.onLine) {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
  });
}

export function login({ login, password }) {
  return fetch(userURL, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    return response.json();
  });
}
