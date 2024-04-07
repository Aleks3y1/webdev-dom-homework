import {
  currentInputName,
  currentInputText,
  checkStatus,
  fetchAndRenderTasks,
  commentsList,
  commentList,
  commentButton,
  deleteButton,
} from "./main.js";
import { getTodos, postComment } from "./api.js";

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
        renderComments(commentList, commentsList);
      } else {
        commentIndex.isLiked = true;
        commentIndex.likes = commentIndex.likes + 1;
        renderComments(commentList, commentsList);
      }
    });
  }
};

export const reComment = () => {
  const commentElement = document.querySelectorAll(".comment");

  for (const textElement of commentElement) {
    textElement.addEventListener("click", () => {
      const indexElementInClick = [
        ...document.querySelectorAll(".comment"),
      ].indexOf(textElement);
      let nameComment = commentsList[indexElementInClick].author.name;
      currentInputText.value = `>${commentsList[
        indexElementInClick
      ].text.replaceAll("&gt;", ">")}
${nameComment}, `;
    });
  }
};

export function render(elemen) {
  return `
    <li class="comment">
      <div class="comment-header">
        <div>${sanitize(elemen.author.name)}</div>
        <div>${currentDateForComment(elemen)}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${sanitize(elemen.text)}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${elemen.likes}</span>
          <button data-index="${elemen.id}" class="like-button ${
    elemen.isLiked ? "-active-like" : ""
  }"></button>
        </div>
      </div>
    </li>`;
}

export const renderComments = (commentList, commentsList) => {
  commentList.innerHTML = commentsList
    .map((elem) => {
      return render(elem);
    })
    .join("");
  likesActive();
  reComment();
};

export function addNewComment(retry = 3) {
  if (
    currentInputName.value.trim().length !== 0 &&
    currentInputText.value.trim().length !== 0
  ) {
    let thisText = currentInputText.value;
    let thisName = currentInputName.value;
    checkStatus.style.display = "none";
    let newDiv = document.createElement("div");
    newDiv.classList.add("newComment");
    commentList.insertAdjacentElement("afterend", newDiv);
    document.querySelector(".newComment").innerHTML = "Комментарий добавляется";

    postComment(currentInputText, currentInputName)
      .then(() => {
        return fetchAndRenderTasks();
      })
      .then(() => {
        currentInputText.value = "";
        currentInputName.value = "";
        document.querySelector(".newComment").remove();
        checkStatus.style.display = "flex";
        renderComments(commentList, commentsList);
      })
      .catch((error) => {
        if (
          error.message === "Сервер сломался. Попробуйте позже." &&
          thisText.length > 2 &&
          thisName.length > 2
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
          currentInputText.value = thisText;
          currentInputName.value = thisName;
          throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
        }
        document.querySelector(".newComment").remove();
        checkStatus.style.display = "flex";
        currentInputText.value = thisText;
        currentInputName.value = thisName;
      });
  }
}

export const disableForm = (check) => {
  check = document.querySelector(".add-form");
  check.addEventListener("input", () => {
    if (
      currentInputName.value.trim().length !== 0 &&
      currentInputText.value.trim().length !== 0
    ) {
      commentButton.removeAttribute("disabled");
      commentButton.style.backgroundColor = "#bcec30";
    } else {
      commentButton.setAttribute("disabled", true);
      commentButton.style.backgroundColor = "grey";
    }
  });
};

export const addOnEnter = () => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !commentButton.hasAttribute("disabled")) {
      addNewComment();
    }
  });
};

export const addCommentOnClick = () => {
  commentButton.addEventListener("click", () => {
    addNewComment();
  });
};

export const deleteComment = () => {
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

export const start = () => {
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
      } else if (!window.navigator.onLine) {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
      }
    });
};
