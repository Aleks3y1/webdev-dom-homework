import { getTodos } from "./api.js";
import {
  renderComments,
  likesActive,
  disableForm,
  deleteComment,
  addCommentOnClick,
  addOnEnter,
} from "./helpers.js";

export let commentsList = [];
export const currentInputName = document.querySelector(".add-form-name");
export const currentInputText = document.querySelector(".add-form-text");
export const commentButton = document.querySelector(".add-form-button");
export const commentList = document.querySelector(".comments");
export const checkStatus = document.querySelector(".add-form");
export const deleteButton = document.querySelector(".delete-form-button");

likesActive();

const start = () => {
  let newDiv = document.createElement("div");
  newDiv.classList.add("newComment");
  commentList.insertAdjacentElement("afterend", newDiv);
  document.querySelector(".newComment").innerHTML =
    "Список комментариев загружается...";
  getTodos()
    .then((responseData) => {
      commentsList = responseData.comments;
      renderComments(commentList, commentsList);
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
}
start();

export const fetchAndRenderTasks = () => {
  return getTodos()
    .then((responseData) => {
      commentsList = responseData.comments;
      renderComments();
    })
    .catch((error) => {
      if (error.message === "Сервер сломался. Попробуйте позже.") {
        alert("Сервер сломался. Попробуйте позже.");
      } else if (!window.navigator.onLine) {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
      }

      return;
    });
}

disableForm(checkStatus);
addCommentOnClick();
addOnEnter();
deleteComment();
renderComments(commentList, commentsList);
