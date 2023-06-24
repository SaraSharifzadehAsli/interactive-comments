# Interactive comments section

![Design preview for the Interactive comments section coding challenge](./design/desktop-preview.jpg)

## Welcome! 👋

Thanks for checking out this front-end coding challenge. This is project will put your JavaScript skills to the test.

**To do this challenge, you need a strong understanding of HTML, CSS and JavaScript.**

## Table of contents

- [Built with](#built-with)
- [The challenge](#the-challenge)
- [Expected behaviour](#expected-behaviour)
- [Where to find everything](#where-to-find-everything)
- [Building your project](#building-your-project)

### Built with

- Semantic HTML5 markup
- Write your styles using a pre-processor, such as SASS/SCSS.
- Flexbox
- CSS Grid
- Mobile-first workflow
- vanilla JS (Do Not Use a JavaScript framework/library)

## The challenge

Your challenge is to build out this interactive comments section and get it looking as close to the design as possible.

We provide the data in a local `data.json` file, so use that to populate the content on the first load. If you want to take it up a notch, feel free to build this with simple Rest api or fake json server.

Your users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Expected behaviour

- First-level comments should be ordered by their score, whereas nested replies are ordered by time added.
- Replying to a comment adds the new reply to the bottom of the nested replies within that comment.
- A confirmation modal should pop up before a comment or reply is deleted.
- Adding a new comment or reply uses the `currentUser` object from within the `data.json` file.
- You can only edit or delete your own comments and replies.

## Where to find everything

Your task is to build out the project to the designs inside the `/design` folder. You will find both a mobile and a desktop version of the design.

The designs are in JPG static format. Using JPGs will mean that you'll need to use your best judgment for styles such as `font-size`, `padding` and `margin`.

If you would like the design files to inspect the design in more detail, use this link.
https://www.figma.com/file/4BVxo9qbJw32CG8lZTWkVd/interactive-comments-section-(Community)?t=wYeLRS6vP7k3N6k3-6

You will find all the required assets in the `/images` folder. The assets are already optimized.

There is also a `style-guide.md` file containing the information you'll need, such as color palette and fonts.

## Building your project

Feel free to use any workflow that you feel comfortable with. Below is a suggested process, but do not feel like you need to follow these steps:

1. Initialize your project as a public repository on [GitHub](https://github.com/). If you're not sure how to do this, [have a read-through of this Try Git resource](https://try.github.io/).
2. Look through the designs to start planning out how you'll tackle the project. This step is crucial to help you think ahead for CSS classes to create reusable styles.
3. Before adding any styles, structure your content with HTML. Writing your HTML first can help focus your attention on creating well-structured content.
4. Write out the base styles for your project, including general content styles, such as `font-family` and `font-size`.
5. Start adding styles to the top of the page and work down. Only move on to the next section once you're happy you've completed the area you're working on.

**Have fun building!** 🚀
