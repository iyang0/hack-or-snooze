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
  let starSymbol ="";

  if(currentUser !== undefined){
    let favoriteStories = new Set(currentUser.favorites.map( story => story.storyId));
    let isInFavorites = favoriteStories.has(story.storyId);
    let starColor = (isInFavorites) ? "fas" : "far";
    starSymbol =`
          <span class = "star" > 
            <i class="fa-star ${starColor}"></i>
          </span>`;
  }

  //const hostName = story.getHostName();
  const hostName = story.url;
  return $(`
      <li id="${story.storyId}">
      ${starSymbol}
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

/**updates the dom  list of favorited stories */
function putFavoritesOnPage(){
  console.debug("putFavoritesOnPage");
  $("#favorited-stories").empty();
  $("#submit-form").hide();

  for(let story of currentUser.favorites){
    const $story  = generateStoryMarkup(story);
    // $story.prepend($(`<span class = "star" > <i class="fas fa-star"> </i></span>`));
    $("#favorited-stories").append($story);
  }
}

/** put my submissions on page*/
function putSubmissionsOnPage(){
  console.debug("putSubmissionsOnPage")
  $("#my-stories").empty()
  
  for(let story of currentUser.ownStories){
    const $story  = generateStoryMarkup(story);
    // $story.prepend($(`<span class = "star" > <i class="fas fa-star"> </i></span>`));
    $("#my-stories").append($story);
  }

}


/** takes in a user as input and creates and returns a new story
* based on what is in the submission form fields for author, title, and URL
*/
async function submitNewStory(evt){
  console.debug("submit Story");
  let author = $("#create-author").val();
  let title = $("#create-title").val();
  let url = $("#create-url").val();
  
  $("#submit-form").hide();
  
  //call the addStory method
  let newStory = await storyList.addStory(currentUser, {title, author, url})
  
  //update the story list and put it onto the page
  storyList.stories.unshift(newStory);
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  
}

$("#submit-form").on("submit", submitNewStory);

async function deleteStory(evt){

  let removedResponse = await axios({
    url: `${BASE_URL}/stories/${evt.storyId}`,
    method: "DELETE",
    params: { token: currentUser.loginToken }
  }
  )

  return removedResponse.data.story

}


/** add star to the story's DOM element */
/* function addStarToStories(){
  // let favoriteStories = currentUser.favorites.map( story => story.storyId);
  let favoriteStories = new Set(currentUser.favorites.map( story => story.storyId));
  let $stories =  $allStoriesList.children();

  // for each story, check if it is in user's favorite
  // then prepend a blank or filled star depending on if it is
  for( let story of $stories ){
    
    let isInFavorites = favoriteStories.has($(story).attr("id"));
    let starColor = (isInFavorites) ? "fas" : "far";

    let starSymbol = $(`<span class = "star" > <i class="fa-star ${starColor}"> </i></span>`);
    $(story).prepend(starSymbol);
  }

} */

/** when a star is click it gets the story from the ID
 * then it would call favorites or unfavorites depending  
 * if it was in the user's favorite list
*/
async function starClickHandler(evt){
    
    let storyId = $(evt.target).parents("li").attr("id");

    const response = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "GET",
    });
    
    let clickedStory = response.data.story;
    
    let isInFavorite = currentUser.favorites.some( story =>{ 
      return clickedStory.storyId === story.storyId
    });
    
    if(isInFavorite){
      currentUser.unFavorite(clickedStory);
    }else{
      currentUser.addFavorite(clickedStory)
    }
    $(evt.target).toggleClass("fas far");
}


$(".stories-container").on("click", "i", starClickHandler);