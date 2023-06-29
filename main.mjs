// import data from "./data.json" assert { type: "json" };
// console.log(data);

import {
  AddComment,
  CardNavigation,
  CardFooter,
  ConfirmationModal,
} from './components.mjs'

async function runApp() {
  const response = await fetch('./data.json')
  const data = await response.json()
  renderApp(data)
}

function renderApp(data) {
  const {comments, currentUser} = data
  const container = document.querySelector('.container')

  for (let i = 0; i < comments.length; i++) {
    let isCurrentUser = comments[i].user.username === currentUser.username
    const li = document.createElement('li')
    li.classList.add('card')
    const markup = `
    <div class="card__content">
      ${CardNavigation(
        comments[i].user.image.webp,
        comments[i].user.username,
        comments[i].createdAt,
        isCurrentUser
      )}
      <p class="card__comment">${comments[i].content}</p>
    </div>
    ${CardFooter(comments[i].score, i, isCurrentUser)}
    `
    li.innerHTML = markup
    container.appendChild(li)
    for (let j = 0; j < comments[i].replies.length; j++) {
      isCurrentUser =
        comments[i].replies[j].user.username === currentUser.username
      const firstReply = j ? '' : 'firstReply'
      const li = document.createElement('li')
      li.classList.add('reply__container')
      const markup = `
      <div class="reply__border--left ${firstReply}"></div> 
      <div class="card">
        <div class="card__content">
        ${CardNavigation(
          comments[i].replies[j].user.image.webp,
          comments[i].replies[j].user.username,
          comments[i].replies[j].createdAt,
          isCurrentUser
        )}
          <p class="card__comment"><span>@${
            comments[i].replies[j].replyingTo
          }</span> ${comments[i].replies[j].content}</p>
        </div>
        ${CardFooter(
          comments[i].replies[j].score,
          comments[i].replies.length + j,
          isCurrentUser
        )}
      </div>
      `
      li.innerHTML = markup
      container.appendChild(li)
    }
  }
  const li = document.createElement('li')
  const markup = AddComment(currentUser.image.png)
  li.innerHTML = markup
  container.appendChild(li)
  const deleteCard = document.querySelector('.card__delete')
  deleteCard.addEventListener('click', (e) => {
    const markup = ConfirmationModal()
    const confirmationModal = document.createElement('div')
    confirmationModal.innerHTML = markup
    container.appendChild(confirmationModal)
    const card = deleteCard.closest('.card')
    const yesDelete = document.querySelector('.confirmation-modal__yes')
    const noCancel = document.querySelector('.confirmation-modal__no')
    console.log(yesDelete)
    console.log(noCancel)
    yesDelete.addEventListener('click', (e) => {
      confirmationModal.style.display = 'none'
      card.style.display = 'none'
    })
    noCancel.addEventListener('click', (e) => {
      confirmationModal.style.display = 'none'
    })
  })
}

runApp()

window.likeCommentHandler = (i) => {
  const reviewNumber = document.querySelectorAll('.card__review__number')[i]
  reviewNumber.innerHTML++
}

window.dislikeCommentHandler = (i) => {
  const reviewNumber = document.querySelectorAll('.card__review__number')[i]
  Number(reviewNumber.innerHTML) ? reviewNumber.innerHTML-- : null
  // change style of - (curser & opacity) ?
}

// window.deleteHandler = (deleteCard) => {
//   deleteCard.closest('.card').style.display = 'none'
// event ??? style???
// }

// function deleteHandler(e) {
//   console.log(e.target)
// }

function saveLocalComments(newChange) {
  const comments = []
  if (localStorage.getItem('comments') !== null) {
    comments = JSON.parse(localStorage.getItem('comments'))
  }
  comments.push(newChange)
  localStorage.setItem('comments', JSON.stringify(comments))
}
