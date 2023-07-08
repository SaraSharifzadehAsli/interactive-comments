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

  // Update the createdAt property of each comment
  data.comments.forEach((comment) => {
    const createdAt = comment.createdAt
    const convertedDate = convertRelativeTime(createdAt)
    comment.convertedDate = convertedDate
    comment.replies.forEach((reply) => {
      const createdAt = reply.createdAt
      const convertedDate = convertRelativeTime(createdAt)
      reply.convertedDate = convertedDate
    })
  })

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
  const markup = AddComment(currentUser.image.png, 'SEND')
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
            deleteObjectById(obj.replies, id)
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
  const send = document.querySelector('.add-comment__send')
  send.addEventListener('click', (e) => {
    const newId = findMaxId(comments) + 1
    const inputCurrentUserValue = document.querySelector(
      '.add-comment__input'
    ).value
    const newObj = {
      id: newId,
      content: inputCurrentUserValue,
      convertedDate: new Date(),
      createdAt: '1 second ago',
      score: 0,
      user: currentUser,
      replies: [],
    }
    comments.push(newObj)
    saveLocalComments(data)
  })
  const edit = document.querySelectorAll('.card__edit')
  for (let i = 0; i < edit.length; i++) {
    edit[i].addEventListener('click', (e) => {
      const card = edit[i].closest('.card')
      const id = Number(card.id)
      const content = card.querySelector('.card__comment')
      const contentParent = card.querySelector('.card__content')
      if (!card.querySelector('.add-comment__input')) {
        let textContent = ''

        for (let node of content.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.textContent.trim()
          }
        }

        const textarea = document.createElement('textarea')
        textarea.value = textContent
        textarea.classList.add('add-comment__input')
        textarea.style.marginTop = '16px'
        contentParent.appendChild(textarea)
        content.style.display = 'none'
        autoResizeTextarea(textarea)
        textarea.focus()
        const updateButton = document.createElement('button')
        updateButton.classList.add('card__update')
        updateButton.innerText = 'UPDATE'
        card.appendChild(updateButton)
        updateButton.addEventListener('click', (e) => {
          changeObjectById(comments, id, 'content', textarea.value)
          saveLocalComments(data)
        })
      }
    })
  }
  const reply = document.querySelectorAll('.card__reply')
  for (let i = 0; i < reply.length; i++) {
    reply[i].addEventListener('click', () => {
      const card = reply[i].closest('.card')
      if (!document.getElementById(`reply_${Number(card.id)}`)) {
        const li = document.createElement('li')
        li.setAttribute('id', `reply_${Number(card.id)}`)
        const replyContainer = card.closest('.reply__container')
        if (replyContainer) {
          const markup = `<div class="reply__border--left"></div> ${AddComment(
            currentUser.image.png,
            'REPLY'
          )}`
          li.classList.add('reply__container')
          li.innerHTML = markup
          replyContainer.insertAdjacentElement('afterend', li)
        } else {
          const markup = AddComment(currentUser.image.png, 'REPLY')
          li.innerHTML = markup
          card.insertAdjacentElement('afterend', li)
        }
        const textarea = li.querySelector('.add-comment__input')
        const replyingTo = card.querySelector('.card__nav__name').innerText
        // console.log(textarea)
        // console.log(li)
        const replyButton = li.querySelector('.add-comment__send')
        console.log(replyButton)
        replyButton.addEventListener('click', (e) => {
          const content = textarea.value
          const newObj = {
            id: findMaxId(comments) + 1,
            content: content,
            convertedDate: new Date(),
            createdAt: '1 second ago',
            score: 0,
            replyingTo: replyingTo,
            user: currentUser,
          }
          insertObjectById(comments, Number(card.id), newObj)
          saveLocalComments(data)
        })
      }
    })
  }
}

function changeObjectById(array, id, changedProperty, newValueProperty) {
  for (let i = 0; i < array.length; i++) {
    const obj = array[i]
    if (obj.id === id) {
      obj[changedProperty] = newValueProperty
      return
    }
    if (obj.replies && obj.replies.length > 0) {
      changeObjectById(obj.replies, id, changedProperty, newValueProperty)
    }
  }
}

function insertObjectById(array, id, newObject) {
  for (let i = 0; i < array.length; i++) {
    const obj = array[i]
    if (obj.id === id) {
      obj.replies.push(newObject)
    }
    if (obj.replies && obj.replies.length > 0) {
      for (let j = 0; j < obj.replies.length; j++) {
        if (obj.replies[j].id === id) {
          obj.replies.push(newObject)
        }
      }
    }
  }
  console.log(array)
  // sortComment(array)
}

function saveLocalComments(newChange) {
  localStorage.clear()
  const data = newChange

  // Update the createdAt property of each comment
  data.comments.forEach((comment) => {
    const convertedDate = comment.convertedDate
    const timeInterval = getTimeInterval(convertedDate)
    comment.createdAt = timeInterval
  })

  for (let i = 0; i < data.comments.length; i++) {
    data.comments[i].replies.forEach((reply) => {
      const convertedDate = reply.convertedDate
      const timeInterval = getTimeInterval(convertedDate)
      reply.createdAt = timeInterval
    })
  }
  sortComments(data.comments)
  localStorage.setItem('comments', JSON.stringify(data))
  document.querySelector('.container').innerHTML = ''
  renderApp(data)
}

function getCommentsLocal() {
  let data
  if (localStorage.getItem('comments') !== null) {
    data = JSON.parse(localStorage.getItem('comments'))

    // Update the createdAt property of each comment
    data.comments.forEach((comment) => {
      const convertedDate = comment.convertedDate
      const timeInterval = getTimeInterval(convertedDate)
      comment.createdAt = timeInterval
    })

    for (let i = 0; i < data.comments.length; i++) {
      data.comments[i].replies.forEach((reply) => {
        const convertedDate = reply.convertedDate
        const timeInterval = getTimeInterval(convertedDate)
        reply.createdAt = timeInterval
      })
    }
    sortComments(data.comments)
    renderApp(data)
  } else {
    runApp()
  }
}

// Function to recursively find the maximum ID
function findMaxId(comments) {
  let maxId = -Infinity

  for (let i = 0; i < comments.length; i++) {
    const obj = comments[i]
    const currentId = obj.id

    // If the current ID is greater than the max ID, update maxId
    if (currentId > maxId) {
      maxId = currentId
    }

    // Check if the object has children and recursively call the function
    if (obj.replies && obj.replies.length > 0) {
      const childMaxId = findMaxId(obj.replies)
      if (childMaxId > maxId) {
        maxId = childMaxId
      }
    }
  }

  return maxId
}

// Function to convert relative time to actual date
function convertRelativeTime(relativeTime) {
  const current = new Date()

  // Extract the numeric value and unit from the relative time string
  const [value, unit] = relativeTime.split(' ')

  // Calculate the actual date based on the unit
  let date
  if (unit.includes('second')) {
    date = new Date(current.getTime() - value * 1000)
  } else if (unit.includes('minute')) {
    date = new Date(current.getTime() - value * 60 * 1000)
  } else if (unit.includes('hour')) {
    date = new Date(current.getTime() - value * 60 * 60 * 1000)
  } else if (unit.includes('day')) {
    date = new Date(current.getTime() - value * 24 * 60 * 60 * 1000)
  } else if (unit.includes('week')) {
    date = new Date(current.getTime() - value * 24 * 60 * 60 * 1000 * 7)
  } else if (unit.includes('month')) {
    date = new Date(
      current.getFullYear(),
      current.getMonth() - value,
      current.getDate(),
      current.getHours(),
      current.getMinutes(),
      current.getSeconds()
    )
  } else if (unit.includes('year')) {
    date = new Date(
      current.getFullYear() - value,
      current.getMonth(),
      current.getDate(),
      current.getHours(),
      current.getMinutes(),
      current.getSeconds()
    )
  }

  return date
}
// .toLocaleDateString('fa-IR')
// Function to calculate the time interval
function getTimeInterval(createdAt) {
  const now = new Date()
  const created = new Date(createdAt)
  const diff = now.getTime() - created.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`
  }
}

function autoResizeTextarea(element) {
  element.style.height = 'auto' // Reset the height to auto to calculate the actual height

  // Set the height of the textarea to its scroll height
  element.style.height = `${element.scrollHeight}px`
  // element.style.overflow = 'hidden'
}

// function sortComments(comments) {
//   let copyComment
//   for (let i = 0; i < comments.length; i++) {
//     if (comments[i + 1] && comments[i + 1].score > comments[i].score) {
//       console.log(comments[i])
//       copyComment = comments[i]
//       comments[i] = comments[i + 1]
//       comments[i + 1] = copyComment
//     }
//     // debugger
//     if (comments[i].replies && comments[i].replies.length > 0) {
//       for (let j = 0; j < comments[i].replies.length; j++) {
//         if (
//           comments[i].replies[j + 1] &&
//           comments[i].replies[j + 1].convertedDate >
//             comments[i].replies[j].convertedDate
//         ) {
//           copyComment = comments[i].replies[j]
//           comments[i].replies[j] = comments[i].replies[j + 1]
//           comments[i].replies[j + 1] = copyComment
//         }
//       }
//     }
//   }
// }

function sortComments(comments) {
  comments.sort((a, b) => b.score - a.score)

  for (let comment of comments) {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.sort(
        (a, b) => new Date(b.convertedDate) - new Date(a.convertedDate)
      )
    }
  }
}
