import {getTodos} from "./api.js";

export const renderComplete = (commentList, commentsList, renderComments) => {
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

export const renderCommentForm = () => {
    let divForm = document.createElement("div");
    divForm.classList.add("add-form");
    document.querySelector(".comments").insertAdjacentElement("afterend", divForm);
    document.querySelector(".add-form").innerHTML = `
            <input
          type="text"
          class="add-form-name"
          placeholder="Введите ваше имя"
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
    `;
}