export function getTodos() {
  return fetch("https://wedev-api.sky.pro/api/v1/aleksey-e/comments", {
    method: "GET",
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

export function postComment(text, name) {
  return fetch("https://wedev-api.sky.pro/api/v1/aleksey-e/comments", {
    method: "POST",
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
