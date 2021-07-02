"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
  // addStarToStories();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show submit form on click of "submit" */

function navToggleStoryForm(evt) {
  console.debug("navToggleStoryForm");
  navAllStories(evt);
  $("#submit-form").slideToggle();
}

$("#nav-submit-story").on("click", navToggleStoryForm);


/** show favorites list on click of "favorites" **/
function toggleFavoritesList(evt){
  console.debug("toggleFavoritesList");
  $allStoriesList.hide();
  putFavoritesOnPage();
  $("#favorited-stories").show();

}

$("#nav-favorites").on("click", toggleFavoritesList);


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/**create my stories page */
function toggleMyStories(){

}



