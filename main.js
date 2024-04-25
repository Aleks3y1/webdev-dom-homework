import { getTodos } from "./api.js";
import { authnPage } from "./renderAuthorization.js";
import {
  currentDateForComment,
  likesActive,
  renderComments,
} from "./helpers.js";

export let commentsList = [];
export const commentList = document.querySelector(".comments");
export const checkStatus = document.querySelector(".add-form");
export const deleteButton = document.querySelector(".delete-form-button");

likesActive();

export const fetchAndRenderTasks = () => {
  getTodos()
    .then((responseData) => {
      commentsList = responseData.comments.map((comment) => {
        return {
          id: comment.id,
          name: comment.author.name,
          date: comment.date,
          text: comment.text, 
          likesCounter: comment.likes,
          likeButton: false,
        };
      });
      renderComments();
    })
    .catch((error) => {
      if (error.message === "Сервер сломался. Попробуйте позже.") {
        alert("Сервер сломался. Попробуйте позже.");
      } else if (!window.navigator.onLine) {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
      }
      return true;
    });
};

export const start = () => {
  let newDiv = document.createElement("div");
  newDiv.classList.add("newComment");
  commentList.insertAdjacentElement("afterend", newDiv);
  document.querySelector(".newComment").innerHTML =
    "Список комментариев загружается...";

  getTodos()
    .then((responseData) => {
      commentsList = responseData.comments;
      renderComments(commentList);
    })
    .then(() => {
      document.querySelector(".newComment").remove();
    })
    .catch((error) => {
      if (error.message === "Сервер сломался. Попробуйте позже.") {
        alert("Сервер сломался. Попробуйте позже.");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
    });
  let divRegistration = document.createElement("div");
  divRegistration.classList.add("registration");
  commentList.insertAdjacentElement("afterend", divRegistration);
  document.querySelector(".registration").innerHTML =
    "<p>Чтобы добавить комментарий, <a class='auth' href='#'>авторизируйтесь<a/></p>";
  const authElem = document.querySelector(".auth");

  authElem.addEventListener("click", () => {
    authnPage({ fetchAndRenderTasks });
  });
};


start();

