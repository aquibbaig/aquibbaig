$(document).ready(function() {
  $nav = $('.nav');
  $toggleCollapse = $('.toggle-collapse');

  // Toggle click on hamburger icon.
  $toggleCollapse.click(function() {
    $nav.toggleClass('collapse');
  });
});