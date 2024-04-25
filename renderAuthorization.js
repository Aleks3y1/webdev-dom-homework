import { getTodos, login, setToken } from "./api.js";
import {
  nameAuthor,
  renderComments,
} from "./helpers.js";


export const authnPage = () => {
  document.querySelector(".container").innerHTML = `
    <div class="add-form">
    <div class="auth-tag">Форма входа</div>
        <input
          type="text"
          class="add-auth-text auth-name"
          placeholder="Введите логин"
        />
        <input
        type="password"
        class="add-auth-text auth-password"
        placeholder="Введите пароль"
      />
        <div class="auth-buttons">
          <button class="auth-agree">Войти</button>
          <a class="reg-button" href="#">Зарегистрироваться</a>
        </div>
      </div> 
    `;
  const regElem = document.querySelector(".reg-button");

  regElem.addEventListener("click", () => {
    regPage();
  });
  const authElem = document.querySelector(".auth-agree");
  const loginInputValue = document.querySelector(".auth-name");
  const passwordInputValue = document.querySelector(".auth-password");

  authElem.addEventListener("click", () => {
    login({
      login: loginInputValue.value,
      password: passwordInputValue.value,
    })
      .then((responseData) => {
        setToken(responseData.user.token);
      })
      .then(() => {
        renderPage();
        // renderComments(commentList, commentsList);
        renderCom();
      });
  });
};

export const renderCom = () => {
  const comments = document.querySelector(".comments");
  getTodos()
    .then((responseData) => {
      renderComments(comments);
    })
    .catch((error) => {
      if (error.message === "Сервер сломался. Попробуйте позже.") {
        alert("Сервер сломался. Попробуйте позже.");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
    });
};

export const regPage = () => {
  document.querySelector(".container").innerHTML = `
    <div class="add-form">
    <div class="auth-tag">Форма регистрации</div>
            <input
          type="text"
          class="add-auth-text auth-name"
          placeholder="Введите имя"
        />
        <input
          type="text"
          class="add-auth-text auth-name"
          placeholder="Введите логин"
        />
        <input
        type="text"
        class="add-auth-text auth-password"
        placeholder="Введите пароль"
      />
        <div class="auth-buttons">
          <button class="auth-agree">Зарегистрироваться</button>
          <a class="reg-button auth" href="#">Войти</a>
        </div>
      </div> 
    `;
  const authElem = document.querySelector(".auth");

  authElem.addEventListener("click", () => {
    authnPage();
  });
};

export const renderPage = () => {
  document.querySelector(".container").innerHTML = `
  <ul class="comments">
  <!-- Рендерится из JS -->
</ul>
<div class="add-form">
  <input
    type="text"
    class="add-form-name"
    placeholder="${nameAuthor}"
    disabled="true"
  />
  <textarea
    type="textarea"
    class="add-form-text"
    placeholder="Введите ваш коментарий"
    rows="4"
  ></textarea>
  <div class="add-form-row">
    <button class="delete-form-button">Удалить</button>
    <button class="add-form-button">Написать</button>
  </div>
</div>
</div>
  `;
};
