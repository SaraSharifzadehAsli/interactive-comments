// import data from "./data.json" assert { type: "json" };
// console.log(data);

import {
  AddComment,
  CardNavigation,
  CardFooter,
  ConfirmationModal,
} from './components.mjs'

document.addEventListener('DOMContentLoaded', getCommentsLocal)

async function runApp() {
  const response = await fetch('./data.json')
  const data = await response.json()
  saveLocalComments(data)
}

function renderApp(data) {
  const {comments, currentUser} = data
  const container = document.querySelector('.container')

  for (let i = 0; i < comments.length; i++) {
    let isCurrentUser = comments[i].user.username === currentUser.username
    const li = document.createElement('li')
    li.classList.add('card')
    li.setAttribute('id', comments[i].id)
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
    ${CardFooter(comments[i].score, isCurrentUser)}
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
      <div class="card" id=${comments[i].replies[j].id}>
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
        ${CardFooter(comments[i].replies[j].score, isCurrentUser)}
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
  const deleteCard = document.querySelectorAll('.card__delete')
  for (let i = 0; i < deleteCard.length; i++) {
    deleteCard[i].addEventListener('click', (e) => {
      const markup = ConfirmationModal()
      const confirmationModal = document.createElement('div')
      confirmationModal.innerHTML = markup
      container.appendChild(confirmationModal)
      const card = deleteCard[i].closest('.card')
      function deleteObjectById(array, id) {
        for (let i = 0; i < array.length; i++) {
          const obj = array[i]
          if (obj.id === id) {
            array.splice(i, 1)
          }
          if (obj.replies && obj.replies.length > 0) {
            const nestedResult = deleteObjectById(obj.replies, id)
            if (nestedResult) {
            }
          }
        }
      }
      const yesDelete = document.querySelector('.confirmation-modal__yes')
      const noCancel = document.querySelector('.confirmation-modal__no')
      yesDelete.addEventListener('click', (e) => {
        confirmationModal.innerHTML = ''
        deleteObjectById(comments, Number(card.id))
        saveLocalComments(data)
      })
      noCancel.addEventListener('click', (e) => {
        confirmationModal.innerHTML = ''
      })
    })
  }
  const likeComment = document.querySelectorAll('.card__review__plus')
  for (let i = 0; i < likeComment.length; i++) {
    likeComment[i].addEventListener('click', (e) => {
      const id = Number(likeComment[i].closest('.card').id)
      const newScoreValue =
        Number(
          document.querySelectorAll('.card__review__number')[i].innerHTML
        ) + 1
      const reviewMinus = document.querySelectorAll('.card__review__minus')[i]
      changeObjectById(comments, id, 'score', newScoreValue)
      saveLocalComments(data)
      reviewMinus.style.opacity = 1
    })
  }
  const dislikeComment = document.querySelectorAll('.card__review__minus')
  for (let i = 0; i < dislikeComment.length; i++) {
    dislikeComment[i].addEventListener('click', (e) => {
      const score = Number(
        document.querySelectorAll('.card__review__number')[i].innerHTML
      )
      const id = Number(likeComment[i].closest('.card').id)
      const newScoreValue = score - 1
      if (score > 0) {
        changeObjectById(comments, id, 'score', newScoreValue)
        saveLocalComments(data)
      }
    })
  }
}

function changeObjectById(array, id, changedProperty, newValueProperty) {
  for (let i = 0; i < array.length; i++) {
    const obj = array[i]
    if (obj.id === id) {
      obj[changedProperty] = newValueProperty
    }
    if (obj.replies && obj.replies.length > 0) {
      changeObjectById(obj.replies, id, changedProperty, newValueProperty)
    }
  }
}

function saveLocalComments(newChange) {
  localStorage.clear()
  const data = newChange
  localStorage.setItem('comments', JSON.stringify(data))
  document.querySelector('.container').innerHTML = ''
  renderApp(data)
}

function getCommentsLocal() {
  let data
  if (localStorage.getItem('comments') !== null) {
    data = JSON.parse(localStorage.getItem('comments'))
    renderApp(data)
  } else {
    runApp()
  }
}
