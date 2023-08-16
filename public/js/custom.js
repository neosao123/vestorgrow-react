// $(window).on('resize',function(){location.reload();});

$(window).scroll(function () {
  if ($(this).scrollTop() > 20) {
    $("header.topHeader").addClass("sticky-top");
    // $('.feedChatBox').addClass("stickyChatBox");
  } else {
    $("header.topHeader").removeClass("sticky-top");
    // $('.feedChatBox').removeClass("stickyChatBox");
  }
});

var carousel = $(".graphSlider");
carousel.owlCarousel({
  // loop:true,
  margin: 0,
  nav: false,
  dots: false,
  // autoplay:true,
  // autoplayTimeout:1000,
  // autoplayHoverPause:true,
  // responsiveClass:true,
  responsive: {
    0: {
      items: 1,
    },
    575: {
      items: 2,
    },
    768: {
      items: 4,
    },
    991: {
      items: 5,
    },
    1200: {
      items: 6,
    },
  },
});

checkClasses();
carousel.on("translated.owl.carousel", function (event) {
  checkClasses();
});

function checkClasses() {
  var total = $(".graphSlider .owl-stage .owl-item.active").length;

  $(".graphSlider .owl-stage .owl-item").removeClass("firstActiveItem lastActiveItem");

  $(".graphSlider .owl-stage .owl-item.active").each(function (index) {
    if (index === 0) {
      // this is the first one
      $(this).addClass("firstActiveItem");
    }
    if (index === total - 1 && total > 1) {
      // this is the last one
      $(this).addClass("lastActiveItem");
    }
  });
}

$(".toggleFeedChat").click(function () {
  $(".feedChatBox").toggleClass("active");
});

$(".toggleIcon a").click(function () {
  $(".themeSidebar").toggleClass("active");
});

$(".moreMenuToggle").click(function () {
  $(".moreMenu").toggleClass("active");
});

$(".imageCheckbox input:checkbox").change(function () {
  if ($(this).is(":checked")) {
    $(this).parents(".galleryImgInner").find(".selectGalleryImgCheck").addClass("selected");
  } else {
    $(this).parents(".galleryImgInner").find(".selectGalleryImgCheck").removeClass("selected");
  }
});

// Slider Graph Js Start

// USD

var usd_ctx = document.getElementById("usd").getContext("2d");

var purple_orange_gradient = usd_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, "rgb(133 255 159 / 50%)");
purple_orange_gradient.addColorStop(0.1, "rgb(133 255 159 / 10%)");

var usd = new Chart(usd_ctx, {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        // label: '# of Votes',
        data: [4, 10, 6, 12, 7, 16, 5, 7, 11, 9],
        backgroundColor: purple_orange_gradient,
        fill: true,
      },
    ],
  },

  options: {
    responsive: false,
    point: {
      radius: 0,
    },
    plugins: {
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
      legend: {
        display: false, //This will do the task
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderColor: "#12A432",
        borderWidth: 1,
      },
      labels: {
        boxWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  },
});

// EURUSD
var eurusd_ctx = document.getElementById("eurusd").getContext("2d");

var purple_orange_gradient = eurusd_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, "rgb(255 140 140 / 50%)");
purple_orange_gradient.addColorStop(0.1, "rgb(255 140 140 / 10%)");

var eurusd = new Chart(eurusd_ctx, {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        // label: '# of Votes',
        data: [4, 10, 6, 12, 7, 16, 5, 7, 11, 9],
        backgroundColor: purple_orange_gradient,
        fill: true,
      },
    ],
  },

  options: {
    responsive: false,
    point: {
      radius: 0,
    },
    plugins: {
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
      legend: {
        display: false, //This will do the task
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderColor: "#DE5B5B",
        borderWidth: 1,
      },
      labels: {
        boxWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  },
});

// OIL
var oil_ctx = document.getElementById("oil").getContext("2d");

var purple_orange_gradient = oil_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, "rgb(255 140 140 / 50%)");
purple_orange_gradient.addColorStop(0.1, "rgb(255 140 140 / 10%)");

var oil = new Chart(oil_ctx, {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        // label: '# of Votes',
        data: [4, 10, 6, 12, 7, 16, 5, 7, 11, 9],
        backgroundColor: purple_orange_gradient,
        fill: true,
      },
    ],
  },

  options: {
    responsive: false,
    point: {
      radius: 0,
    },
    plugins: {
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
      legend: {
        display: false, //This will do the task
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderColor: "#DE5B5B",
        borderWidth: 1,
      },
      labels: {
        boxWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  },
});

// DJ30
var dj30_ctx = document.getElementById("dj30").getContext("2d");

var purple_orange_gradient = dj30_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, "rgb(255 140 140 / 50%)");
purple_orange_gradient.addColorStop(0.1, "rgb(255 140 140 / 10%)");

var dj30 = new Chart(dj30_ctx, {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        // label: '# of Votes',
        data: [4, 10, 6, 12, 7, 16, 5, 7, 11, 9],
        backgroundColor: purple_orange_gradient,
        fill: true,
      },
    ],
  },

  options: {
    responsive: false,
    point: {
      radius: 0,
    },
    plugins: {
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
      legend: {
        display: false, //This will do the task
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderColor: "#DE5B5B",
        borderWidth: 1,
      },
      labels: {
        boxWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  },
});

// SPX500
var spx500_ctx = document.getElementById("spx500").getContext("2d");

var purple_orange_gradient = spx500_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, "rgb(255 140 140 / 50%)");
purple_orange_gradient.addColorStop(0.1, "rgb(255 140 140 / 10%)");

var spx500 = new Chart(spx500_ctx, {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        // label: '# of Votes',
        data: [4, 10, 6, 12, 7, 16, 5, 7, 11, 9],
        backgroundColor: purple_orange_gradient,
        fill: true,
      },
    ],
  },

  options: {
    responsive: false,
    point: {
      radius: 0,
    },
    plugins: {
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
      legend: {
        display: false, //This will do the task
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderColor: "#DE5B5B",
        borderWidth: 1,
      },
      labels: {
        boxWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  },
});

// NSDQ100
var nsdq100_ctx = document.getElementById("nsdq100").getContext("2d");

var purple_orange_gradient = nsdq100_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, "rgb(133 255 159 / 50%)");
purple_orange_gradient.addColorStop(0.1, "rgb(133 255 159 / 10%)");

var nsdq100 = new Chart(nsdq100_ctx, {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        // label: '# of Votes',
        data: [4, 10, 6, 12, 7, 16, 5, 7, 11, 9],
        backgroundColor: purple_orange_gradient,
        fill: true,
      },
    ],
  },

  options: {
    responsive: false,
    point: {
      radius: 0,
    },
    plugins: {
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
      legend: {
        display: false, //This will do the task
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderColor: "#12A432",
        borderWidth: 1,
      },
      labels: {
        boxWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  },
});

// Slider Graph Js End

// tooltip js Start
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
// tooltip js End
