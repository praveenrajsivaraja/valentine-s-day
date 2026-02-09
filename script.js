(function () {
  "use strict";

  const screenWelcome = document.getElementById("screenWelcome");
  const screenCard = document.getElementById("screenCard");
  const screenSuccess = document.getElementById("screenSuccess");
  const btnOpenWelcome = document.getElementById("btnOpenWelcome");
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const buttonsContainer = document.querySelector(".screen-card-buttons");
  const subtitle = document.getElementById("subtitle");
  const floatingHearts = document.getElementById("floatingHearts");
  const confettiContainer = document.getElementById("confettiContainer");
  const successHearts = document.getElementById("successHearts");
  const giftFileInput = document.getElementById("giftFileInput");
  const giftAddHint = document.getElementById("giftAddHint");
  const secretWordForm = document.getElementById("secretWordForm");
  const secretWordInput = document.getElementById("secretWordInput");
  const secretWordError = document.getElementById("secretWordError");
  const memorySlideshow = document.getElementById("memorySlideshow");
  const memorySlideshowImage = document.getElementById("memorySlideshowImage");
  const memorySlideshowClose = document.getElementById("memorySlideshowClose");
  const memorySlideshowCaption = document.getElementById("memorySlideshowCaption");
  const successChangeMindWrap = document.getElementById("successChangeMindWrap");
  const successChangeMindBtn = document.getElementById("successChangeMindBtn");
  const successBelowContent = document.getElementById("successBelowContent");
  const btnActuallyNo = document.getElementById("btnActuallyNo");

  const GIFT_STORAGE_KEY = "valentineGiftImages";

  /* Change this to the special word only you two know */
  const SECRET_WORD = "mama";

  const MEMORY_IMAGE_PATHS = [
    "Photos/WIN_4269.JPG",
    "Photos/WIN_4297.JPG",
    "Photos/WIN_4307.JPG",
    "Photos/WIN_4325.JPG",
    "Photos/WIN_4328.JPG",
    "Photos/WIN_4333.JPG",
  ];

  /* Caption for each memory image (edit to match your memories) */
  const MEMORY_CAPTIONS = [
    "A moment we'll never forget ♥",
    "Together is our favourite place",
    "This day meant everything",
    "Us against the world",
    "Forever and always",
    "Our story, our memories",
  ];

  const noMessages = [
    "Are you sure?",
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

  const confettiColors = [
    "#e63946",
    "#ff6b6b",
    "#ff9a9e",
    "#fec89a",
    "#c1121f",
    "#ffcad4",
  ];

  if (!btnYes || !btnNo || !screenCard || !screenSuccess || !buttonsContainer) {
    return;
  }

  let noHoverCount = 0;

  function getRandomOffset(maxPixels) {
    return Math.floor(Math.random() * (2 * maxPixels + 1)) - maxPixels;
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function moveNoButton() {
    const noRect = btnNo.getBoundingClientRect();
    const padding = 60;
    const maxDeltaX = Math.max(200, window.innerWidth / 2 - noRect.width - padding);
    const maxDeltaY = Math.max(150, window.innerHeight / 2 - noRect.height - padding);

    const deltaX = getRandomOffset(maxDeltaX);
    const deltaY = getRandomOffset(maxDeltaY);

    btnNo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    if (subtitle) {
      noHoverCount += 1;
      const index = Math.min(noHoverCount - 1, noMessages.length - 1);
      subtitle.textContent = noMessages[index];
      subtitle.classList.add("surprise");
      setTimeout(function () {
        subtitle.classList.remove("surprise");
      }, 400);
    }
  }

  function resetNoButton() {
    btnNo.style.transform = "";
  }

  function moveActuallyNoButton() {
    if (!btnActuallyNo) return;
    const rect = btnActuallyNo.getBoundingClientRect();
    const padding = 60;
    const maxDeltaX = Math.max(200, window.innerWidth / 2 - rect.width - padding);
    const maxDeltaY = Math.max(150, window.innerHeight / 2 - rect.height - padding);
    const deltaX = getRandomOffset(maxDeltaX);
    const deltaY = getRandomOffset(maxDeltaY);
    btnActuallyNo.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";
  }

  function resetActuallyNoButton() {
    if (btnActuallyNo) btnActuallyNo.style.transform = "";
  }

  function createFloatingHearts() {
    if (!floatingHearts) return;
    const heartChars = ["♥", "❤", "💕"];
    const count = 50;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("span");
      el.className = "heart";
      el.textContent = heartChars[i % heartChars.length];
      el.style.left = getRandom(0, 100) + "%";
      el.style.animationDelay = getRandom(0, 20) + "s";
      el.style.animationDuration = getRandom(10, 22) + "s";
      el.style.fontSize = getRandom(0.85, 2) + "rem";
      el.style.opacity = getRandom(0.2, 0.5).toFixed(2);
      floatingHearts.appendChild(el);
    }
  }

  function createConfettiBurst() {
    if (!confettiContainer) return;
    const heartChar = "♥";
    const count = 60;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("span");
      el.className = "confetti " + (i % 3 === 0 ? "heart" : "");
      if (i % 3 === 0) {
        el.textContent = heartChar;
        el.style.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      } else {
        el.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      }
      el.style.left = getRandom(20, 80) + "%";
      el.style.top = "50%";
      el.style.animationDelay = getRandom(0, 0.5) + "s";
      el.style.animationDuration = getRandom(2, 4) + "s";
      confettiContainer.appendChild(el);
      setTimeout(function () {
        el.remove();
      }, 4500);
    }
  }

  function showSuccessHearts() {
    if (!successHearts) return;
    let html = "";
    for (let i = 0; i < 12; i += 1) {
      html += "<span class=\"success-heart\" style=\"animation-delay: " + (i * 0.08) + "s\">♥</span>";
    }
    successHearts.innerHTML = html;
  }

  let successRevealTimeout = null;

  function revealSuccessBelowContent() {
    if (successRevealTimeout) {
      clearTimeout(successRevealTimeout);
      successRevealTimeout = null;
    }
    if (successChangeMindWrap) successChangeMindWrap.classList.add("hidden");
    if (successBelowContent) successBelowContent.classList.remove("hidden");
  }

  function onYesClick() {
    screenCard.classList.add("hidden");
    createConfettiBurst();
    screenSuccess.classList.remove("hidden");
    showSuccessHearts();
    loadGiftImages();
    if (successBelowContent) successBelowContent.classList.add("hidden");
    if (successChangeMindWrap) successChangeMindWrap.classList.remove("hidden");
    successRevealTimeout = setTimeout(function () {
      revealSuccessBelowContent();
    }, 10000);
  }

  if (successChangeMindBtn) {
    successChangeMindBtn.addEventListener("click", function () {
      revealSuccessBelowContent();
    });
  }

  if (btnActuallyNo && successChangeMindWrap) {
    btnActuallyNo.addEventListener("mouseenter", moveActuallyNoButton);
    btnActuallyNo.addEventListener("focus", moveActuallyNoButton);
    btnActuallyNo.addEventListener("touchstart", function (e) {
      e.preventDefault();
      moveActuallyNoButton();
    }, { passive: false });
    successChangeMindWrap.addEventListener("mouseleave", resetActuallyNoButton);
  }

  function getStoredGiftImages() {
    try {
      const raw = localStorage.getItem(GIFT_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function resolveImageSrc(path) {
    if (!path) return path;
    if (path.indexOf("data:") === 0 || path.indexOf("http:") === 0 || path.indexOf("https:") === 0) {
      return path;
    }
    try {
      return new URL(path, document.baseURI || window.location.href).href;
    } catch (e) {
      return path;
    }
  }

  function openGiftItem(coverEl) {
    const item = coverEl.closest(".gift-gallery-item");
    if (!item) return;
    const img = item.querySelector(".gift-item-image");
    if (!img) return;
    const dataSrc = img.getAttribute("data-src");
    if (dataSrc) {
      img.src = resolveImageSrc(dataSrc);
      img.removeAttribute("data-src");
      img.onerror = function () {
        img.alt = "Image could not be loaded. Use a local server (e.g. npx serve .).";
      };
    }
    img.classList.remove("hidden");
    item.classList.add("opened");
  }

  function attachGiftItemHandlers(galleryEl) {
    if (!galleryEl) return;
    const covers = galleryEl.querySelectorAll(".gift-item-cover");
    covers.forEach(function (cover) {
      cover.addEventListener("click", function () {
        openGiftItem(cover);
      });
    });
  }

  function renderGiftGalleryFromStorage(storedImages) {
    const gallery = document.getElementById("giftGallery");
    if (!gallery) return;
    gallery.innerHTML = "";
    storedImages.forEach(function (item, index) {
      const src = typeof item === "string" ? item : (item && item.src);
      if (!src) return;
      const alt = (item && item.alt) || "Gift image " + (index + 1);
      const itemEl = document.createElement("div");
      itemEl.className = "gift-gallery-item";
      itemEl.innerHTML =
        "<button type=\"button\" class=\"gift-item-cover\" aria-label=\"Open image\"><span class=\"gift-item-icon\">🎁</span> Click to open</button>" +
        "<img class=\"gift-item-image hidden\" data-src=\"" + src.replace(/"/g, "&quot;") + "\" alt=\"" + alt.replace(/"/g, "&quot;") + "\" loading=\"lazy\" />";
      gallery.appendChild(itemEl);
    });
    attachGiftItemHandlers(gallery);
  }

  function loadGiftImages() {
    const gallery = document.getElementById("giftGallery");
    if (!gallery) return;
    const stored = getStoredGiftImages();
    if (stored && stored.length > 0) {
      renderGiftGalleryFromStorage(stored);
      return;
    }
  }

  function attachCouponHandlers(galleryEl) {
    if (!galleryEl) return;
    galleryEl.addEventListener("click", function (e) {
      const cover = e.target.closest(".gift-coupon-cover");
      if (!cover) return;
      const item = cover.closest(".gift-coupon-item");
      if (!item) return;
      const gallery = document.getElementById("giftGallery");
      if (!gallery) return;
      const allItems = gallery.querySelectorAll(".gift-coupon-item");
      allItems.forEach(function (el) {
        el.classList.remove("selected");
      });
      item.classList.add("selected");
    });
  }

  const giftGalleryEl = document.getElementById("giftGallery");
  if (giftGalleryEl) attachCouponHandlers(giftGalleryEl);

  function getMemoryImageData() {
    const defaultData = MEMORY_IMAGE_PATHS.map(function (path, i) {
      return { src: resolveImageSrc(path), caption: MEMORY_CAPTIONS[i] || "Our memory ♥" };
    });
    const gallery = document.getElementById("giftGallery");
    if (!gallery) return defaultData;
    const images = gallery.querySelectorAll(".gift-item-image");
    if (!images || images.length === 0) return defaultData;
    const data = [];
    images.forEach(function (img, i) {
      const raw = img.getAttribute("data-src") || img.src;
      if (!raw) return;
      const src = resolveImageSrc(raw);
      let caption = "Our memory ♥";
      const pathIndex = MEMORY_IMAGE_PATHS.findIndex(function (p) {
        return raw.indexOf(p) !== -1 || (img.getAttribute("data-src") && img.getAttribute("data-src").indexOf(p) !== -1);
      });
      if (pathIndex !== -1 && MEMORY_CAPTIONS[pathIndex]) caption = MEMORY_CAPTIONS[pathIndex];
      else if (MEMORY_CAPTIONS[i]) caption = MEMORY_CAPTIONS[i];
      data.push({ src: src, caption: caption });
    });
    return data.length > 0 ? data : defaultData;
  }

  let memorySlideshowInterval = null;

  function startMemorySlideshow() {
    const data = getMemoryImageData();
    if (!memorySlideshow || !memorySlideshowImage || data.length === 0) return;
    memorySlideshow.classList.remove("hidden");
    memorySlideshow.setAttribute("aria-hidden", "false");
    let index = 0;
    memorySlideshowImage.src = data[0].src;
    if (memorySlideshowCaption) memorySlideshowCaption.textContent = data[0].caption;
    memorySlideshowImage.onerror = function () {
      memorySlideshowImage.alt = "Image could not be loaded.";
    };
    if (memorySlideshowInterval) clearInterval(memorySlideshowInterval);
    memorySlideshowInterval = setInterval(function () {
      index = (index + 1) % data.length;
      memorySlideshowImage.src = data[index].src;
      if (memorySlideshowCaption) memorySlideshowCaption.textContent = data[index].caption;
    }, 4000);
  }

  function stopMemorySlideshow() {
    if (memorySlideshowInterval) {
      clearInterval(memorySlideshowInterval);
      memorySlideshowInterval = null;
    }
    if (memorySlideshow) {
      memorySlideshow.classList.add("hidden");
      memorySlideshow.setAttribute("aria-hidden", "true");
    }
  }

  let secretWordAttemptCount = 0;

  if (secretWordForm && secretWordInput && secretWordError) {
    secretWordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const entered = (secretWordInput.value || "").trim().toLowerCase();
      const expected = (SECRET_WORD || "").toLowerCase();
      secretWordAttemptCount += 1;
      secretWordError.classList.remove("hidden");

      if (secretWordAttemptCount === 1) {
        secretWordError.textContent = "Note : It has 4 letters but give me a kisses to get the hint 😉";
      } else if (secretWordAttemptCount === 2) {
        secretWordError.textContent = "Note : This is the  last change give me 5 kisses to get the hint or else you will be in trouble 😈 ";
      } else {
        if (entered === expected) {
          secretWordError.classList.add("hidden");
          secretWordInput.value = "";
          startMemorySlideshow();
          return;
        }
        const kissesCount = 10 + (secretWordAttemptCount - 3) * 5;
        secretWordError.textContent = "Now you have no other choice give me " + kissesCount + " kisses to get the hint 💕";
      }
    });
  }

  if (memorySlideshowClose) {
    memorySlideshowClose.addEventListener("click", stopMemorySlideshow);
  }

  function saveImagesToStorage(files, callback) {
    if (!files || files.length === 0) {
      if (callback) callback(0);
      return;
    }
    const results = [];
    let done = 0;
    const total = files.length;
    function maybeFinish() {
      done += 1;
      if (done === total) {
        try {
          const existing = getStoredGiftImages() || [];
          const combined = existing.concat(results);
          localStorage.setItem(GIFT_STORAGE_KEY, JSON.stringify(combined));
          if (callback) callback(combined.length);
        } catch (e) {
          if (callback) callback(-1);
        }
      }
    }
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (!file.type || file.type.indexOf("image/") !== 0) {
        maybeFinish();
        continue;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target && e.target.result;
        if (dataUrl) results.push({ src: dataUrl, alt: file.name });
        maybeFinish();
      };
      reader.onerror = maybeFinish;
      reader.readAsDataURL(file);
    }
  }

  if (giftFileInput) {
    giftFileInput.addEventListener("change", function () {
      const files = this.files;
      if (!files || files.length === 0) return;
      saveImagesToStorage(Array.from(files), function (count) {
        if (giftAddHint) {
          if (count > 0) {
            giftAddHint.textContent = count + " photo(s) added to your gift!";
            giftAddHint.classList.add("gift-add-success");
          } else if (count === -1) {
            giftAddHint.textContent = "Storage full or error. Try fewer/smaller images.";
            giftAddHint.classList.remove("gift-add-success");
          }
        }
        giftFileInput.value = "";
      });
    });
  }

  if (btnOpenWelcome) {
    btnOpenWelcome.addEventListener("click", function () {
      if (screenWelcome) screenWelcome.classList.add("hidden");
      if (screenCard) screenCard.classList.remove("hidden");
    });
    btnOpenWelcome.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btnOpenWelcome.click();
      }
    });
  }

  btnNo.addEventListener("mouseenter", moveNoButton);
  btnNo.addEventListener("focus", moveNoButton);

  btnNo.addEventListener("touchstart", function (e) {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  buttonsContainer.addEventListener("mouseleave", resetNoButton);

  btnYes.addEventListener("click", onYesClick);

  btnYes.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onYesClick();
    }
  });

  createFloatingHearts();
})();
