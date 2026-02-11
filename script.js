(function () {
  "use strict";

  // --- Config (secret word can be overridden via data attribute on body or form)
  var SECRET_WORD_DEFAULT = "mama";
  var NO_BUTTON_RUN_SPEED = 80;
  var CONFETTI_COUNT = 60;
  var FLOATING_HEARTS_COUNT = 12;
  var HEART_SYMBOLS = ["♥", "💕", "💗", "❤", "💖"];
  var SLIDESHOW_AUTO_INTERVAL_MS = 9000;
  var SUCCESS_AUTO_NEXT_MS = 10000;
  var successAutoNextTimeoutId = null;

  // Photo memories: caption = filename without extension; src = URL-encoded path
  // Reference details (First mirror selfie): vertical mirror selfie, couple smiling; woman (left) long dark wavy hair,
  // glasses, black long-sleeved top, blue jeans, bindi, thin gold chain with pendant; man (right) beard, white collared
  // shirt, blue jeans, holding smartphone taking the selfie, green braided bracelet; indoors, well-lit mirror.
  var APOSTROPHE_CURLY = "\u2019"; // right single quotation mark (often in filenames from phones/Word)

  function captionFromSrc(rawPath) {
    var name = rawPath.replace(/^photos\//, "");
    var lastDot = name.lastIndexOf(".");
    var base = lastDot === -1 ? name : name.slice(0, lastDot);
    return base.replace( new RegExp(APOSTROPHE_CURLY, "g"), "'" );
  }

  function encodePhotoPath(rawPath) {
    var slash = rawPath.indexOf("/");
    if (slash === -1) return encodeURIComponent(rawPath);
    var folder = rawPath.slice(0, slash + 1);
    var filename = rawPath.slice(slash + 1);
    return folder + encodeURIComponent(filename);
  }

  // Single source: path + caption per photo
  var MEMORY_PHOTOS_RAW = [
    { path: "photos/01-first-mirror-selfie.JPG", caption: "First mirror selfie, and it became my all-time favorite." },
    { path: "photos/02-first-month-togetherness.JPG", caption: "First month of togetherness" },
    { path: "photos/03-first-rooftop-dream.jpg", caption: "First-ever rooftop, like a dream. You, the ambiance, the food, and the music kept me high throughout the day." },
    { path: "photos/04-love-came-back-to-me.JPG", caption: "For the first time, the love I gave came back to me." },
    { path: "photos/05-the-gift.JPG", caption: "I didn't expect a gift, but it meant everything. I never expected anything before, because I never received it. Now, I have you." },
    { path: "photos/06-waited-for-this-moment.JPG", caption: "I was supposed to do this earlier, but I waited for this moment." },
    { path: "photos/07-engagement-friend-confidence.JPG", caption: "It wasn't just an engagement; it was the moment I found a friend I can rely on and love with all my confidence." },
    { path: "photos/08-mayajal-beautiful.jpg", caption: "Mayajal… uff. I've visited it many times, yet you made the moment feel fresh, memorable, and beautiful." },
    { path: "photos/09-first-rose.JPG", caption: "My first-ever rose, bought for a girl. Words fall short for how this feels." },
    { path: "photos/10-first-adventure.jpg", caption: "Our first adventure, and the most memorable moment of my life so far" },
    { path: "photos/11-first-video-call.jpg", caption: "Our first ever comfortable video call" },
    { path: "photos/12-first-silfi-yes.jpg", caption: "Our first ever silfi, Honstly i was not ready for this i was preparing myself for a no as always but it was quiet diferent tat day i got yes" },
    { path: "photos/13-first-shopping-date.jpg", caption: "Our first Shopping and date, I was super upset that day but the moment i saw you it changed me completly" },
    { path: "photos/14-hangout-chennai.JPG", caption: "Our first-ever hangout in Chennai; you, the food, and the place were soo perfect." },
    { path: "photos/15-late-night-dinner.JPG", caption: "That special late night dinner." },
    { path: "photos/16-brownie-confidence.JPG", caption: "The brownie may look simple, but its impact on me was so delicious." },
    { path: "photos/17-first-day-caught-up.jpg", caption: "The first day we caught up, finding love, laughter, drives, and endless moments." },
    { path: "photos/18-go-cart.jpg", caption: "The go cart" },
    { path: "photos/19-moment-safe-comfortable.jpg", caption: "The moment that made me feel safe and comfortable with you." },
    { path: "photos/20-phone-first-gift.JPG", caption: "The phone was the first gift I planned for you that day. I still remember how adorably awkward you were trying to get my number." },
    { path: "photos/21-secret-bus-travel.jpg", caption: "The secret bus travel" },
    { path: "photos/22-cake-confidence.JPG", caption: "This cake may be simple, but it gave me a lot of confidence in you and your opinion." },
    { path: "photos/23-formality-temple-meeting.JPG", caption: "This was just a formality; I was already married to you the day you sat wit me and spoke so comfortably in the temple during our first meeting." },
    { path: "photos/24-comfortable-fam-vibe.JPG", caption: "This was the moment wher i felt soo confortable wher i found not just you and your entire fam is in my vibe." },
    { path: "photos/25-best-gift-received.PNG", caption: "You are the best gift I've ever received." },
    { path: "photos/26-all-time-fav.PNG", caption: "My favorite picture ever. Just look at how pretty my lady is… ufff." }
  ];

  var MEMORY_PHOTOS = MEMORY_PHOTOS_RAW.map(function (item) {
    return {
      src: encodePhotoPath(item.path),
      caption: item.caption
    };
  });

  // --- DOM refs
  var screenWelcome = document.getElementById("screenWelcome");
  var screenCard = document.getElementById("screenCard");
  var screenSuccess = document.getElementById("screenSuccess");
  var btnOpenWelcome = document.getElementById("btnOpenWelcome");
  var btnYes = document.getElementById("btnYes");
  var btnNo = document.getElementById("btnNo");
  var subtitle = document.getElementById("subtitle");
  var confettiContainer = document.getElementById("confettiContainer");
  var successChangeMindWrap = document.getElementById("successChangeMindWrap");
  var successChangeMindBtn = document.getElementById("successChangeMindBtn");
  var btnActuallyNo = document.getElementById("btnActuallyNo");
  var successBelowContent = document.getElementById("successBelowContent");
  var successHearts = document.getElementById("successHearts");
  var giftGallery = document.getElementById("giftGallery");
  var secretWordForm = document.getElementById("secretWordForm");
  var secretWordInput = document.getElementById("secretWordInput");
  var secretWordError = document.getElementById("secretWordError");
  var secretWordSuccess = document.getElementById("secretWordSuccess");
  var memorySlideshow = document.getElementById("memorySlideshow");
  var memorySlideshowImage = document.getElementById("memorySlideshowImage");
  var memorySlideshowCaption = document.getElementById("memorySlideshowCaption");
  var memorySlideshowClose = document.getElementById("memorySlideshowClose");
  var memorySlideshowBackdrop = document.getElementById("memorySlideshowBackdrop");
  var memorySlideshowPrev = document.getElementById("memorySlideshowPrev");
  var memorySlideshowNext = document.getElementById("memorySlideshowNext");
  var floatingHeartsContainer = document.getElementById("floatingHearts");
  var buttonsContainer = document.querySelector(".screen-card-buttons");

  var noMessages = [
    "I think ne thappa NO click panna try pannara da papa...",
    "Ingutu venam angutu polam...",
    "Venam Papaa....",
    "Oru alavuku dhan ellam....",
    "Idhu seripattu varadhu poleiyeee... ",
    "Papa... one last chance....",
    "Pretty please....? ♥",
    "Ada yaru da iva...",
    "Ippo enna dhan solla vara....",
    "Enaku unna vitta vera aalu illa purengeko da babyma... ",
    "Idhu seri pattu varadhu unkau avalodhan....",
    "Olunga yes press pannara valeiya paru...."
  ];

  function getSecretWord() {
    var form = document.getElementById("secretWordForm");
    var section = document.getElementById("secretWordSection");
    var word = (form && form.getAttribute("data-secret-word")) ||
               (section && section.getAttribute("data-secret-word")) ||
               (document.body && document.body.getAttribute("data-secret-word"));
    return (word && word.trim()) ? word.trim().toLowerCase() : SECRET_WORD_DEFAULT;
  }

  function showScreen(screenElement) {
    [screenWelcome, screenCard, screenSuccess].forEach(function (el) {
      if (el) el.classList.add("hidden");
    });
    if (screenElement) screenElement.classList.remove("hidden");
  }

  function runConfetti() {
    if (!confettiContainer) return;
    var colors = ["#e63946", "#ff6b6b", "#ffb6c1", "#c9a227", "#fff5f5"];
    for (var i = 0; i < CONFETTI_COUNT; i++) {
      var isHeart = Math.random() > 0.5;
      var el = document.createElement("div");
      el.className = "confetti" + (isHeart ? " heart" : "");
      if (isHeart) {
        el.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
      } else {
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      }
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDelay = Math.random() * 0.6 + "s";
      el.style.animationDuration = (2.5 + Math.random() * 1.5) + "s";
      confettiContainer.appendChild(el);
      setTimeout(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 4500, el);
    }
  }

  function spawnFloatingHearts() {
    if (!floatingHeartsContainer) return;
    for (var i = 0; i < FLOATING_HEARTS_COUNT; i++) {
      (function (index) {
        setTimeout(function () {
          var heart = document.createElement("span");
          heart.className = "heart";
          heart.textContent = HEART_SYMBOLS[index % HEART_SYMBOLS.length];
          heart.style.left = Math.random() * 100 + "%";
          heart.style.animationDelay = Math.random() * 4 + "s";
          heart.style.animationDuration = (12 + Math.random() * 6) + "s";
          floatingHeartsContainer.appendChild(heart);
        }, index * 400);
      })(i);
    }
  }

  function fillSuccessHearts() {
    if (!successHearts) return;
    var count = 15;
    var html = "";
    for (var i = 0; i < count; i++) {
      html += "<span class=\"success-heart\" aria-hidden=\"true\">" + HEART_SYMBOLS[i % HEART_SYMBOLS.length] + "</span>";
    }
    successHearts.innerHTML = html;
  }

  // No button runs away (reference: valentine-s-day — translate + reset on container leave)
  function getRandomOffset(maxPixels) {
    return Math.floor(Math.random() * (2 * maxPixels + 1)) - maxPixels;
  }

  var noHoverCount = 0;

  function moveNoButton() {
    if (!btnNo) return;
    var noRect = btnNo.getBoundingClientRect();
    var padding = 60;
    var maxDeltaX = Math.max(200, window.innerWidth / 2 - noRect.width - padding);
    var maxDeltaY = Math.max(150, window.innerHeight / 2 - noRect.height - padding);
    var deltaX = getRandomOffset(maxDeltaX);
    var deltaY = getRandomOffset(maxDeltaY);
    btnNo.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";
    if (subtitle) {
      noHoverCount += 1;
      var index = Math.min(noHoverCount - 1, noMessages.length - 1);
      subtitle.textContent = noMessages[index];
      subtitle.classList.add("surprise");
      setTimeout(function () {
        subtitle.classList.remove("surprise");
      }, 400);
    }
  }

  function resetNoButton() {
    if (btnNo) btnNo.style.transform = "";
  }

  function moveActuallyNoButton() {
    if (!btnActuallyNo) return;
    var rect = btnActuallyNo.getBoundingClientRect();
    var padding = 60;
    var maxDeltaX = Math.max(200, window.innerWidth / 2 - rect.width - padding);
    var maxDeltaY = Math.max(150, window.innerHeight / 2 - rect.height - padding);
    var deltaX = getRandomOffset(maxDeltaX);
    var deltaY = getRandomOffset(maxDeltaY);
    btnActuallyNo.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";
  }

  function resetActuallyNoButton() {
    if (btnActuallyNo) btnActuallyNo.style.transform = "";
  }

  function initNoButton() {
    if (!btnNo || !buttonsContainer) return;
    btnNo.addEventListener("mouseenter", moveNoButton);
    btnNo.addEventListener("focus", moveNoButton);
    btnNo.addEventListener("touchstart", function (e) {
      e.preventDefault();
      moveNoButton();
    }, { passive: false });
    buttonsContainer.addEventListener("mouseleave", resetNoButton);
  }

  function initActuallyNoButton() {
    if (!btnActuallyNo || !successChangeMindWrap) return;
    btnActuallyNo.addEventListener("mouseenter", moveActuallyNoButton);
    btnActuallyNo.addEventListener("focus", moveActuallyNoButton);
    btnActuallyNo.addEventListener("touchstart", function (e) {
      e.preventDefault();
      moveActuallyNoButton();
    }, { passive: false });
    successChangeMindWrap.addEventListener("mouseleave", resetActuallyNoButton);
  }

  // Coupon click → reveal only this one; hide others when another is selected
  function initCoupons() {
    if (!giftGallery) return;
    giftGallery.addEventListener("click", function (e) {
      var cover = e.target.closest(".gift-coupon-cover");
      if (!cover) return;
      var item = cover.closest(".gift-coupon-item");
      if (!item) return;
      var allItems = giftGallery.querySelectorAll(".gift-coupon-item");
      for (var i = 0; i < allItems.length; i++) {
        allItems[i].classList.remove("selected");
      }
      item.classList.add("selected");
    });
  }

  // Secret word: first 2 attempts always wrong; custom messages per attempt
  var secretWordAttemptCount = 0;

  function setSecretWordErrorMessage() {
    if (!secretWordError) return;
    secretWordError.classList.remove("hidden");
    if (secretWordAttemptCount === 1) {
      secretWordError.textContent = "Note : It has 4 words but give me a kisses to get the hint 😉";
    } else if (secretWordAttemptCount === 2) {
      secretWordError.textContent = "Note : This is the  last change give me 5 kisses to get the hint or else you will be in trouble 😈 ";
    } else {
      var kissesCount = 10 + (secretWordAttemptCount - 3) * 5;
      secretWordError.textContent = "Now you have no other choice give me " + kissesCount + " kisses to get the hint 💕";
    }
  }

  function initSecretWord() {
    if (!secretWordForm || !secretWordInput) return;
    secretWordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (secretWordInput.value || "").trim().toLowerCase();
      var expected = getSecretWord();
      if (secretWordError) secretWordError.classList.add("hidden");
      if (secretWordSuccess) secretWordSuccess.classList.add("hidden");

      secretWordAttemptCount += 1;
      var isForcedWrong = secretWordAttemptCount <= 2;
      var isThirdAttempt = secretWordAttemptCount === 3;
      var actuallyCorrect = value === expected;

      if (isForcedWrong || (isThirdAttempt && !actuallyCorrect)) {
        setSecretWordErrorMessage();
        return;
      }

      if (actuallyCorrect) {
        if (secretWordSuccess) {
          secretWordSuccess.textContent = "You remembered! Here are our memories 💕";
          secretWordSuccess.classList.remove("hidden");
        }
        showMemorySlideshow();
      } else {
        setSecretWordErrorMessage();
      }
    });
  }

  var currentMemoryIndex = 0;
  var slideshowAutoIntervalId = null;

  function stopSlideshowAuto() {
    if (slideshowAutoIntervalId !== null) {
      clearInterval(slideshowAutoIntervalId);
      slideshowAutoIntervalId = null;
    }
  }

  function showMemorySlideshow() {
    if (!memorySlideshow || !MEMORY_PHOTOS.length) return;
    stopSlideshowAuto();
    currentMemoryIndex = 0;
    memorySlideshow.classList.remove("hidden");
    setMemorySlide(0);
    slideshowAutoIntervalId = setInterval(function () {
      setMemorySlide(currentMemoryIndex + 1);
    }, SLIDESHOW_AUTO_INTERVAL_MS);
  }

  function hideMemorySlideshow() {
    if (memorySlideshow) memorySlideshow.classList.add("hidden");
    stopSlideshowAuto();
  }

  function setMemorySlide(index) {
    if (index < 0) index = MEMORY_PHOTOS.length - 1;
    if (index >= MEMORY_PHOTOS.length) index = 0;
    currentMemoryIndex = index;
    var item = MEMORY_PHOTOS[currentMemoryIndex];
    if (memorySlideshowImage) {
      memorySlideshowImage.src = item.src;
      memorySlideshowImage.alt = item.caption;
    }
    if (memorySlideshowCaption) memorySlideshowCaption.textContent = item.caption;
  }

  function initMemorySlideshow() {
    if (memorySlideshowClose) {
      memorySlideshowClose.addEventListener("click", hideMemorySlideshow);
    }
    if (memorySlideshowBackdrop) {
      memorySlideshowBackdrop.addEventListener("click", hideMemorySlideshow);
    }
    if (memorySlideshowPrev) {
      memorySlideshowPrev.addEventListener("click", function (e) {
        e.stopPropagation();
        setMemorySlide(currentMemoryIndex - 1);
      });
    }
    if (memorySlideshowNext) {
      memorySlideshowNext.addEventListener("click", function (e) {
        e.stopPropagation();
        setMemorySlide(currentMemoryIndex + 1);
      });
    }
    if (memorySlideshowImage) {
      memorySlideshowImage.addEventListener("click", function (e) {
        e.stopPropagation();
        setMemorySlide(currentMemoryIndex + 1);
      });
    }
  }

  // --- Wire UI
  if (btnOpenWelcome) {
    btnOpenWelcome.addEventListener("click", function () {
      showScreen(screenCard);
    });
  }

  function moveToSuccessNextScreen() {
    if (successChangeMindWrap) successChangeMindWrap.classList.add("hidden");
    if (successBelowContent) successBelowContent.classList.remove("hidden");
  }

  if (btnYes) {
    btnYes.addEventListener("click", function () {
      if (successAutoNextTimeoutId !== null) {
        clearTimeout(successAutoNextTimeoutId);
        successAutoNextTimeoutId = null;
      }
      runConfetti();
      showScreen(screenSuccess);
      fillSuccessHearts();
      successAutoNextTimeoutId = setTimeout(function () {
        successAutoNextTimeoutId = null;
        moveToSuccessNextScreen();
      }, SUCCESS_AUTO_NEXT_MS);
    });
  }

  initNoButton();
  initActuallyNoButton();
  initCoupons();
  initSecretWord();
  initMemorySlideshow();

  if (successChangeMindBtn) {
    successChangeMindBtn.addEventListener("click", function () {
      if (successChangeMindWrap) successChangeMindWrap.classList.add("hidden");
      if (successBelowContent) successBelowContent.classList.remove("hidden");
    });
  }

  if (btnActuallyNo) {
    btnActuallyNo.addEventListener("click", function () {
      if (successAutoNextTimeoutId !== null) {
        clearTimeout(successAutoNextTimeoutId);
        successAutoNextTimeoutId = null;
      }
      runConfetti();
      moveToSuccessNextScreen();
    });
  }

  spawnFloatingHearts();
})();
