import { fetchAndRenderTasks, commentsList, commentList } from './main.js';
import { deleteApi, likeApi, nameUser, postComment, token } from './api.js';
import { format } from 'date-fns';

export const sanitize = (element) => {
    return `${element
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')}`;
};

// export function currentDateForComment(elem) {
//     const currentDate = new Date(elem.date);
//     return `${currentDate.getDate()}.${
//         currentDate.getMonth() < 8
//             ? '0' + (currentDate.getMonth() + 1)
//             : currentDate.getMonth()
//     }.${currentDate.getFullYear() - 2000}
//         ${
//             currentDate.getHours() < 10
//                 ? '0' + currentDate.getHours()
//                 : currentDate.getHours()
//         }:${
//             currentDate.getMinutes() < 10
//                 ? '0' + currentDate.getMinutes()
//                 : currentDate.getMinutes()
//         }`;
// }

export const reAddNewComment = () => {
    addNewComment();
};

export const likesActive = () => {
    const buttonLikeElements = document.querySelectorAll('.like-button');

    for (const elem of buttonLikeElements) {
        elem.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = [
                ...document.querySelectorAll('.like-button')
            ].indexOf(elem);
            const commentIndex = commentsList[index];
            // if (commentIndex.name !== undefined) {
            //     if (commentIndex.isLiked) {
            //         commentIndex.isLiked = false;
            //         commentIndex.likesCounter = commentIndex.likesCounter - 1;
            //         renderComments(commentList);
            //     } else {
            //         commentIndex.isLiked = true;
            //         commentIndex.likesCounter = commentIndex.likesCounter + 1;
            //         renderComments(commentList);
            //     }
            // } else {

            let idLike = commentIndex.id;
            likeApi({ id: idLike }).then((response) => {
                if (response.result.isLiked) {
                    response.result.isLiked = false;
                    response.result.likes = response.result.likes - 1;

                    fetchAndRenderTasks();
                } else {
                    response.result.isLiked = true;
                    response.result.likes = response.result.likes + 1;

                    fetchAndRenderTasks();
                }
            });
            // }
        });
    }
};

export const reComment = () => {
    const commentElement = document.querySelectorAll('.comment');
    let currentInputText = document.querySelector('.add-form-text');

    for (const textElement of commentElement) {
        textElement.addEventListener('click', () => {
            const indexElementInClick = [
                ...document.querySelectorAll('.comment')
            ].indexOf(textElement);
            let nameComment;
            if (commentsList[indexElementInClick].name !== undefined) {
                nameComment = commentsList[indexElementInClick].name;
            } else {
                nameComment = commentsList[indexElementInClick].author.name;
            }
            currentInputText.value = `>${commentsList[
                indexElementInClick
                ].text.replaceAll('&gt;', '>')}
${nameComment}, `;
        });
    }
};

export function render(element) {
    if (!element) return;
    let authorName;
    let likesCount;
    let isLike;
    if (element.name !== undefined) {
        authorName = element.name;
        likesCount = element.likesCounter;
        isLike = element.likeButton;
    } else {
        authorName = element.author.name;
        likesCount = element.likes;
        isLike = element.isLiked;
    }
    const createDate = format(new Date(element.date), 'yyyy-MM-dd hh.mm.ss');
    return `
    <li class="comment">
      <div class="comment-header">
        <div>${sanitize(authorName)}</div>
        <div>${createDate}</div>
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
        isLike ? '-active-like' : ''
    }"></button>
        </div>
      </div>
    </li>`;
}

let isListenerAdded = false;

export const renderComments = (commentList) => {
    commentList = document.querySelector('.comments');
    commentList.innerHTML = commentsList
        .map((elem) => {
            return render(elem);
        })
        .join('');
    if (
        document.querySelector('.add-form-button') !== null &&
        !isListenerAdded
    ) {
        addCommentOnClick();
        deleteComment();
        disableForm();
        reComment();
        likesActive();
        isListenerAdded = true;
    } else if (document.querySelector('.add-form-button') !== null) {
        disableForm();
        reComment();
        likesActive();
    }
};

export const renderCommentsOnDelete = (list) => {
    list = document.querySelector('.comments');
    list.innerHTML = commentsList
        .map((elem) => {
            return render(elem);
        })
        .join('');
};

export function addNewComment() {
    let InputName = nameUser;
    let InputText = document.querySelector('.add-form-text');

    if (InputText.value.trim().length !== 0) {
        let thisText = InputText.value;
        const checkStatus = document.querySelector('.add-form');
        checkStatus.style.display = 'none';
        let newDiv = document.createElement('div');
        newDiv.classList.add('newComment');
        commentList.insertAdjacentElement('afterend', newDiv);
        newDiv.innerHTML = 'Комментарий добавляется';

        postComment(token, InputText, InputName)
            .then(() => {
                InputText.value = '';
                return fetchAndRenderTasks();
            })
            .then(() => {
                document.querySelector('.newComment').remove();
                checkStatus.style.display = 'flex';
                renderComments(commentList);
            })
            .catch((error) => {
                if (
                    error.message === 'Сервер сломался. Попробуйте позже.' &&
                    thisText.length > 2
                ) {
                    reAddNewComment();
                } else if (
                    error.message === 'Сервер сломался. Попробуйте позже.'
                ) {
                    alert('Сервер сломался. Попробуйте позже.');
                } else if (
                    error.message ===
                    'Имя и комментарий должны быть не короче 3 символов'
                ) {
                    alert('Имя и комментарий должны быть не короче 3 символов');
                } else if (!window.navigator.onLine) {
                    document.querySelector('.newComment').remove();
                    checkStatus.style.display = 'flex';
                    InputText.value = thisText;
                    throw new Error(
                        'Кажется, у вас сломался интернет, попробуйте позже'
                    );
                }
                newDiv.remove();
                checkStatus.style.display = 'flex';
            });
    }
}

const disableForm = (check) => {
    const commentButton = document.querySelector('.add-form-button');
    check = document.querySelector('.add-form');

    check.addEventListener('input', () => {
        let currenText = document.querySelector('.add-form-text');
        if (currenText.value.trim().length > 2) {
            commentButton.removeAttribute('disabled');
            commentButton.style.backgroundColor = '#bcec30';
        } else {
            commentButton.setAttribute('disabled', true);
            commentButton.style.backgroundColor = 'grey';
        }
    });
};

const addOnEnter = () => {
    document.addEventListener('keyup', (e) => {
        const commentButton = document.querySelector('.add-form-button');
        if (e.key === 'Enter' && !commentButton.hasAttribute('disabled')) {
            addNewComment();
        }
    });
};

const addCommentOnClick = () => {
    const clickAddCommentButton = document.querySelector('.add-form-button');
    clickAddCommentButton.addEventListener('click', () => {
        addNewComment();
    });
};

const deleteComment = () => {
    document
        .querySelector('.delete-form-button')
        .addEventListener('click', () => {
            const deleteElement = document.querySelector('.comments');
            if (commentsList.length > 0) {
                let lastElement = commentsList.length - 1;
                let id = commentsList[lastElement].id;
                let delElem = deleteElement.children.item(
                    deleteElement.children.length - 1
                );

                deleteApi({ id }).then(() => {
                    delElem.remove();
                    commentsList.pop();
                    return renderComments(commentList);
                });
            }
        });
};
