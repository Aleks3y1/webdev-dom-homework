import {
  fetchAndRenderTasks,
  commentsList,
  commentList,
  deleteButton,
} from "./main.js";
import { postComment, token } from "./api.js";

export let nameAuthor;

export const sanitize = (element) => {
  return `${element
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")}`;
};

export function currentDateForComment(elem) {
  const currentDate = new Date(elem.date);
  return `${currentDate.getDate()}.${
    currentDate.getMonth() < 8
      ? "0" + (currentDate.getMonth() + 1)
      : currentDate.getMonth()
  }.${currentDate.getFullYear() - 2000}
        ${
          currentDate.getHours() < 10
            ? "0" + currentDate.getHours()
            : currentDate.getHours()
        }:${
    currentDate.getMinutes() < 10
      ? "0" + currentDate.getMinutes()
      : currentDate.getMinutes()
  }`;
}

export const reAddNewComment = (retry = 3) => {
  if (retry > 0) {
    retry -= 1;
    addNewComment(retry);
  } else {
    alert("Не удалось отправить сообщение. Проблемы с сервером.");
  }
};

export const likesActive = () => {
  const buttonLikeElements = document.querySelectorAll(".like-button");

  for (const elem of buttonLikeElements) {
    elem.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = [...document.querySelectorAll(".like-button")].indexOf(
        elem
      );
      const commentIndex = commentsList[index];
      if (commentIndex.isLiked) {
        commentIndex.isLiked = false;
        commentIndex.likes = commentIndex.likes - 1;
        renderComments(commentList);
      } else {
        commentIndex.isLiked = true;
        commentIndex.likes = commentIndex.likes + 1;
        renderComments(commentList);
      }
    });
  }
};

export const reComment = () => {
  const commentElement = document.querySelectorAll(".comment");
  let currentInputText = document.querySelector(".add-form-text");

  for (const textElement of commentElement) {
    textElement.addEventListener("click", () => {
      const indexElementInClick = [
        ...document.querySelectorAll(".comment"),
      ].indexOf(textElement);
      let nameComment;

      if (commentsList[indexElementInClick].name != null) {
        nameComment = commentsList[indexElementInClick].name;
      } else {
        nameComment = commentsList[indexElementInClick].author.name;
      }
      currentInputText.value = `>${commentsList[
        indexElementInClick
      ].text.replaceAll("&gt;", ">")}
${nameComment}, `;
    });
  }
};

export function render(element) {
  let authorName;
  let likesCount;
  let isLike;
  if (typeof element.name != "undefined") {
    authorName = element.name;
    likesCount = element.likesCounter;
    isLike = element.likeButton;
  } else {
    authorName = element.author.name;
    likesCount = element.likes;
    isLike = element.isLiked;
  }
  nameAuthor = authorName;
  return `
    <li class="comment">
      <div class="comment-header">
        <div>${sanitize(authorName)}</div>
        <div>${currentDateForComment(element)}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${sanitize(element.text)}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${likesCount}</span>
          <button data-index="${element.id}" class="like-button ${
    isLike ? "-active-like" : ""
  }"></button>
        </div>
      </div>
    </li>`;
}

export const renderComments = (commentList) => {
  commentList = document.querySelector(".comments");
  commentList.innerHTML = commentsList
    .map((elem) => {
      return render(elem);
    })
    .join("");
  if (document.querySelector(".add-form-button") != null) {
    disableForm();
    //addOnEnter();
    reComment();
    //deleteComment();
    addCommentOnClick();
  }
  likesActive();
};

export function addNewComment(retry = 3) {
  let InputName = nameAuthor;
  let InputText = document.querySelector(".add-form-text");
  if (InputText.value.trim().length !== 0) {
    let thisText = InputText.value;
    const checkStatus = document.querySelector(".add-form");
    checkStatus.style.display = "none";
    let newDiv = document.createElement("div");
    newDiv.classList.add("newComment");
    commentList.insertAdjacentElement("afterend", newDiv);
    newDiv.innerHTML = "Комментарий добавляется";

    postComment(token, InputText, InputName)
      .then(() => {
        InputText.value = "";
        return fetchAndRenderTasks();
      })
      .then(() => {

        document.querySelector(".newComment").remove();
        checkStatus.style.display = "flex";
        renderComments(commentList);
      })
      .catch((error) => {
        if (
          error.message === "Сервер сломался. Попробуйте позже." &&
          thisText.length > 2
        ) {
          reAddNewComment(retry);
        } else if (error.message === "Сервер сломался. Попробуйте позже.") {
          alert("Сервер сломался. Попробуйте позже.");
        } else if (
          error.message === "Имя и комментарий должны быть не короче 3 символов"
        ) {
          alert("Имя и комментарий должны быть не короче 3 символов");
        } else if (!window.navigator.onLine) {
          document.querySelector(".newComment").remove();
          checkStatus.style.display = "flex";
          InputText.value = thisText;
          throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
        }
        newDiv.remove();
        checkStatus.style.display = "flex";
        //InputText.value = thisText;
      });

    // renderPage();
    // renderCom();
    // renderComments(commentList, commentsList);
  }
}

const disableForm = (check) => {
  const commentButton = document.querySelector(".add-form-button");
  check = document.querySelector(".add-form");

  check.addEventListener("input", () => {
    let currenText = document.querySelector(".add-form-text");
    if (currenText.value.trim().length > 2) {
      commentButton.removeAttribute("disabled");
      commentButton.style.backgroundColor = "#bcec30";
    } else {
      commentButton.setAttribute("disabled", true);
      commentButton.style.backgroundColor = "grey";
    }
  });
};

const addOnEnter = () => {
  document.addEventListener("keyup", (e) => {
    const commentButton = document.querySelector(".add-form-button");
    if (e.key === "Enter" && !commentButton.hasAttribute("disabled")) {
      addNewComment();
    }
  });
};

const addCommentOnClick = () => {
  let clickAddCommentButton = document.querySelector(".add-form-button");
  clickAddCommentButton.addEventListener("click", () => {
    addNewComment();
  });
};

const deleteComment = () => {
  deleteButton.addEventListener("click", () => {
    const deleteElement = document.querySelector(".comments");
    if (commentsList.length > 0) {
      let delElem = deleteElement.children.item(
        deleteElement.children.length - 1
      );
      delElem.remove();
      commentsList.pop();
    }
  });
};
