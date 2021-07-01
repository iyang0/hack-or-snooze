"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** takes in a user as input and creates and returns a new story
* based on what is in the submission form fields for author, title, and URL
*/
async function submitNewStory(evt){
  console.debug("submit Story", evt);
  // let userToken = currentUser.loginToken;
  let author = $("#create-author").val();
  let title = $("#create-title").val();
  let url = $("#create-url").val();
  
  $("#submit-form").hide();
  //call the addStory method
  let newStory= await storyList.addStory(currentUser, {title, author, url})
  
  //update the story list and put it onto the page
  storyList.stories.unshift(newStory);
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  
}

$("#submit-form").on("submit", submitNewStory);