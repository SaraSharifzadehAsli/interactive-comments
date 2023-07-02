export function CardReply() {
  return `
  <div class="card__reply">
      <svg
        class="card__reply--icon"
        width="14"
        height="13"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
         fill="#5357B6"
        />
      </svg>
      <p class="card__reply__text">Reply</p>
    </div>
  `
}
// onclick="deleteHandler(this)
export function CardButtons(isCurrentUser) {
  return `<div class="card__buttons">
  ${(() => {
    if (isCurrentUser) {
      return `
      <div class="card__delete">
        <svg class="card__delete--icon" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
        <p class="card__delete__text">Delete</p>
      </div>
      <div class="card__edit">
        <svg class="card__edit--icon" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
        <p class="card__edit__text">Edit</p>
      </div>
      `
    } else {
      return CardReply()
    }
  })()}
</div>`
}

export function CardReview(score) {
  return `
<div class="card__review">
  <svg
    class="card__review__plus"
    width="11"
    height="11"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
      fill="currentColor"
    />
  </svg>
  <div class="card__review__number">${score}</div>
  <svg
    class="card__review__minus ${score ? '' : 'card__review__minus--disabled'}"
    width="11"
    height="3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
      fill="currentColor"
    />
  </svg>
</div>`
}

export function AddComment(currentUserImage) {
  return `
  <div class="add-comment">
    <textarea class="add-comment__input" name="add-comment" placeholder="Add a comment..."></textarea>
    <div class="add-comment__image-send">
      <img class="add-comment__image" src=${currentUserImage} alt="user-image">
      <button class="add-comment__send">SEND</button>
    </div>
  </div>
  `
}

export function CardNavigation(image, name, date, isCurrentUser) {
  return `
  <div class="card__nav">
    <img class="card__nav__image" src=${image} alt="user-image">
    <div class="card__nav__name">${name}</div>
    ${isCurrentUser ? `<div class="card__nav--you">you</div>` : ''}
    <div class="card__nav__date">${date}</div>
  </div>
  `
}

export function CardFooter(score, isCurrentUser) {
  return `
  <div class="card__footer">
  ${CardReview(score)}
  ${CardButtons(isCurrentUser)}
  </div>
  `
}

export function ConfirmationModal() {
  return `
    <div class="confirmation-modal--background"></div>
    <section class="confirmation-modal">
      <h1 class="confirmation-modal__header">Delete Comment</h1>
      <p class="confirmation-modal__text">Are you sure you want to delete this comment? this will remove the comment and can't be undone.</p>
      <div class="confirmation-modal__footer">
        <button class="confirmation-modal__no">NO, CANCEL</button>
        <button class="confirmation-modal__yes">YES, DELETE</button>
      </div>
    </section>
  `
}
