$(document).ready(function() {
  $nav = $('.nav');
  $toggleCollapse = $('.toggle-collapse');

  // Toggle click on hamburger icon.
  $toggleCollapse.click(function() {
    $nav.toggleClass('collapse');
  });

  // Add smooth scroll to links
  // Add smooth scrolling to all links
  $(".scroll").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 1000, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  // Show only 3 projects on
  // the start.
  parseFilterProjectOptions();
  reduceProjects();
  $('.no-projects-message').hide();
  $('#search-project').click(searchProjects);
  $('.btn-projects').click(showAllProjects);
  $('#filter-project').click(toggleFilterOptions);
  getBlogPostReactions();
});

// Search projects on pressing the enter
// button as well.
$(document).on('keypress', function (e) {
  if ($('.searchTerm').is(':focus')) {
    if (e.which == 13) {
      searchProjects();
    }
  }
});

// Projects section handlers.
// display only 3 projects at the start.
function reduceProjects() {
  let index = 0;
  $(".project").each(function (el, val) {
    if (index > 2) {
      $(val).hide();
    }
    index++;
  });
}

// Introduce more tailored search
// by tags or type.
function searchProjects() {
  let projects = [];
  const inputText = $(".searchTerm").val();
  $(".project").each(function (el, val) {
    if ($(val).attr('name').includes(inputText)) {
      projects.push(val);
    }
  });
  // Display only those projects who are asked,
  // else display a message, return early.
  if (projects.length === 0) {
    $(".project").each(function (el, val) {
      $(val).hide();
    });
    $('.no-projects-message').show();
  } else {
    $(".project").each(function (el, val) {
      if ($(val).attr('name').includes(inputText)) {
        $(val).show();
      } else $(val).hide();
    });
  }
}

// Show all of your projects.
function showAllProjects() {
  $(".project").each(function (el, val) {
    $(val).show();
  });
}

// Get reactions to the blog posts.
function getBlogPostReactions() {
  // Post one.
  fetch('https://dev.to/api/articles/349961?api-key=zNWaK2DuxqiNQw6CNxxEr3Uj', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    }
  }).then(resp => {
    return resp.json();
  }).then(data => {
    $('.post-one-reactions').html(data.public_reactions_count);
  });
  // Post two
  fetch('https://dev.to/api/articles/349974?api-key=zNWaK2DuxqiNQw6CNxxEr3Uj', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    }
  }).then(resp => {
    return resp.json();
  }).then(data => {
    $('.post-two-reactions').html(data.public_reactions_count);
  });
}

// Toggles on click of the filter menu
// in the projects section.
function toggleFilterOptions() {
  if ($('.filter-content').css('display') === "none") {
    $(".filter-content").show();
    Object.keys($('.filter-content').children()).forEach(key => {
      let val = $('.filter-content').children()[key];
      if ($(val).prop('nodeName') == 'A') {
        $(val).on('click', filterProjects);
      }
    });
  } else $(".filter-content").hide();
}

function parseFilterProjectOptions() {
  let allTagValues = [];
  $('.project').each(function (el, val) {
    $(val).attr('tags').split(" ").forEach(function (tag) {
      allTagValues.push(tag);
    });
  });
  const removeDuplicates = (arr) => arr.filter((v,i) => arr.indexOf(v) === i);
  const tags = removeDuplicates(allTagValues);
  tags.forEach(tag => {
    let anchor = document.createElement('a');
    anchor.setAttribute('id', tag);
    anchor.setAttribute('style', 'cursor: pointer');
    // anchor.setAttribute('href', '');
    $(anchor).html(tag);
    $('.filter-content').append(anchor);
  });
}

// Filters projects based on selections.
function filterProjects(e) {
  e.preventDefault();
  let selectedTag = e.target.attributes['id'].value;
  let present;
  $('.project').each(function (el, val) {
    present = "false";
    // Go through each tag for a project to find similarities.
    $(val).attr('tags').split(" ").forEach(function (tag) {
      if (tag === selectedTag) {
        present = "true";
        $(val).show();
      }
    });
    if (present == "false") {
      console.log(val);
      $(val).hide();
    }
  });
}

// Canvas
(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
          window.setTimeout(callback, 1000 / 60);
      };
  window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
  bgCtx = background.getContext("2d"),
  width = window.innerWidth,
  height = document.body.offsetHeight;

(height < 400) ? height = 400 : height;

background.width = width;
background.height = height;


// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
  this.size = Math.random() * 2.8 ;
  this.speed = Math.random() * .05;
  this.x = options.x;
  this.y = options.y;
}

Star.prototype.reset = function () {
  this.size = Math.random() * 2;
  this.speed = Math.random() * .05;
  this.x = width;
  this.y = Math.random() * height;
}

Star.prototype.update = function () {
  this.x -= this.speed;
  if (this.x < 0) {
      this.reset();
  } else {
      bgCtx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function ShootingStar() {
  this.reset();
}

ShootingStar.prototype.reset = function () {
  this.x = Math.random() * width;
  this.y = 0;
  this.len = (Math.random() * 80) + 10;
  this.speed = (Math.random() * 5) + 6;
  this.size = (Math.random() * 1) + 0.1;
  // this is used so the shooting stars arent constant
  this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
  this.active = false;
}

ShootingStar.prototype.update = function () {
  if (this.active) {
      this.x -= this.speed;
      this.y += this.speed;
      if (this.x < 0 || this.y >= height) {
          this.reset();
      } else {
          bgCtx.lineWidth = this.size;
          bgCtx.beginPath();
          bgCtx.moveTo(this.x, this.y);
          bgCtx.lineTo(this.x + this.len, this.y - this.len);
          bgCtx.stroke();
      }
  } else {
      if (this.waitTime < new Date().getTime()) {
          this.active = true;
      }
  }
}

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
  console.log(height, width);
  entities.push(new Star({
      x: Math.random() * width,
      y: Math.random() * height
  }));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());

//animate background
function animate() {
  bgCtx.fillStyle = '#123981';
  bgCtx.fillRect(0, 0, width, height);
  bgCtx.fillStyle = '#ffffff';
  bgCtx.strokeStyle = '#ffffff';

  var entLen = entities.length;

  while (entLen--) {
      entities[entLen].update();
  }
  requestAnimationFrame(animate);
}
animate();
// (end) Canvas