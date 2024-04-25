import {login, setToken} from "./api.js";
import {commentList, commentsList, fetchAndRenderTasks} from "./main.js";
import {renderComplete, renderCommentForm} from "./renderComplete.js";
import {renderComments} from "./helpers.js";

export const loginFunc = () => {
    const loginInput = document.querySelector(".auth-name");
    const passwordInput = document.querySelector(".auth-password");
    const buttonElement = document.querySelector(".auth-agree");

    buttonElement.addEventListener("click", () => {
        const loginInput = document.querySelector(".auth-name");
        const passwordInput = document.querySelector(".auth-password");
        login({
            login: loginInput.value,
            password: passwordInput.value,
        }).then((responseData) => {
            setToken(responseData.user.token);
        }).then(() => {
            //return renderComplete(commentList, commentsList, renderComments);
        })
    })
}