const scenes = [...document.querySelectorAll(".scene")];
const transition = document.querySelector("#scene-transition");
const gameWorld = document.querySelector("#game-world");
const particles = document.querySelector("#floating-particles");
const loadingProgress = document.querySelector("#loading-progress");
const loadingCopy = document.querySelector("#loading-copy");
const skipIntro = document.querySelector("#skip-intro");
const startButton = document.querySelector("#start-button");
const backgroundMusic = document.querySelector("#background-music");
const catActionVideos = [...document.querySelectorAll("[data-cat-video]")];
const companionStage = document.querySelector(".companion-video-stage");
const catActionTitle = document.querySelector("#cat-action-title");
const catActionKicker = document.querySelector("#cat-action-kicker");
const companionWindChime = document.querySelector("#companion-wind-chime");
const companionCatHotspot = document.querySelector("#companion-cat-hotspot");
const companionCatDialog = document.querySelector("#companion-cat-dialog");
const companionCatDialogClose = document.querySelector("#companion-cat-dialog-close");
const settingsButton = document.querySelector("[data-quick-action='settings']");
const settingsModal = document.querySelector("#settings-modal");
const settingsVolume = document.querySelector("#settings-volume");
const settingsVolumeValue = document.querySelector("#settings-volume-value");
const settingsStatus = document.querySelector("#settings-status");
const moodButton = document.querySelector("[data-quick-action='mood']");
const moodModal = document.querySelector("#mood-modal");
const rewardTreeStage = document.querySelector("#reward-tree-stage");
const rewardCoins = [...document.querySelectorAll("[data-reward-coin]")];
const archiveItems = [...document.querySelectorAll("[data-archive-item]")];
const diaryCards = [...document.querySelectorAll("[data-diary-card]")];
const soundToggle = document.querySelector("#sound-toggle");
const fullscreenToggle = document.querySelector("#fullscreen-toggle");
const candyEntrances = [...document.querySelectorAll(".realm-play-trigger, .realm-backpack-trigger")];
const meadowRealm = document.querySelector("[data-realm='meadow']");
const meadowVideo = document.querySelector("#meadow-video");
const meadowVideoToggle = document.querySelector("#meadow-video-toggle");
const forestRealm = document.querySelector("[data-realm='forest']");
const forestVideo = document.querySelector("#forest-video");
const forestVideoToggle = document.querySelector("#forest-video-toggle");
const forestInteraction = document.querySelector("#forest-interaction");
const forestCursorGlow = document.querySelector("#forest-cursor-glow");
const forestCatResponse = document.querySelector("#forest-cat-response");
const iwModal = document.querySelector("#iwModal");
const iwCount = document.querySelector("#iwCount");
const iwBtnGo = document.querySelector("#iwBtnGo");
const iwItems = iwModal ? [...iwModal.querySelectorAll(".iw-item")] : [];
const focusMinuteWheel = document.querySelector("#focus-minute-wheel");
const focusMinuteValue = document.querySelector("#focus-minute-value");
const focusMinuteUp = document.querySelector("#focus-minute-up");
const focusMinuteDown = document.querySelector("#focus-minute-down");
const departureCountdown = document.querySelector("#departure-countdown");
const departureCountdownValue = document.querySelector("#departure-countdown-value");
const wishField = document.querySelector("#wish-field");
const playBackgroundVideo = document.querySelector("#play-background-video");
const wishCount = document.querySelector("#wish-count");
const wishDots = document.querySelector("#wish-dots");
const completionCard = document.querySelector("#completion-card");
const completionClose = document.querySelector("#completion-close");
const replayButton = document.querySelector("#replay-button");
const closeGuide = document.querySelector("#close-guide");
const guideBubble = document.querySelector("#guide-bubble");
const packingNote = document.querySelector("#packing-note");
const playTip = document.querySelector("#play-tip");
const completionMessage = document.querySelector("#completion-message");
const focusTimerChips = [...document.querySelectorAll(".focus-timer-chip")];
const focusTimerDisplays = [...document.querySelectorAll("[data-focus-countdown]")];
const mapTomatoTimer = document.querySelector("#map-tomato-timer");
const mapTimerDisplay = document.querySelector("#map-timer-display");
const mapTimerStatus = document.querySelector("#map-timer-status");
const mapJourneyStory = document.querySelector("#map-journey-story");
const focusResultCard = document.querySelector("#focus-result-card");
const focusResultClose = document.querySelector("#focus-result-close");
const focusResultAgain = document.querySelector("#focus-result-again");
const focusResultHome = document.querySelector("#focus-result-home");
const focusResultMessage = document.querySelector("#focus-result-message");
const focusResultItems = document.querySelector("#focus-result-items");
const fishCursor = document.querySelector("#fish-cursor");
const catCursor = document.querySelector("#cat-cursor");
const cursorAura = document.querySelector("#cursor-aura");
const touchRipples = document.querySelector("#touch-ripples");

const MIN_FOCUS_MINUTES = 1;
const MAX_FOCUS_MINUTES = 60;
const FOCUS_PICKER_VISIBLE_COUNT = 5;
const BACKGROUND_MUSIC_UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"];

const state = {
  currentScene: "loading",
  wishes: 0,
  totalWishes: 5,
  transitioning: false,
  introFinished: false,
  soundOn: true,
  soundVolume: 0.7,
  audioContext: null,
  musicUnlockBound: false,
  packedItems: new Set(),
  cursor: { x: innerWidth / 2, y: innerHeight / 2 },
  fish: { x: innerWidth / 2, y: innerHeight / 2 },
  cat: { x: innerWidth / 2 - 45, y: innerHeight / 2 + 20 },
  idleTimer: null,
  forestInteractTimer: null,
  catDialogTimer: null,
  videoFadeTimers: [],
  focusMinutes: 25,
  focusRemainingSeconds: 0,
  focusTimerId: null,
  focusActive: false,
  focusSessionEnded: false,
  focusResultVisible: false,
  journeyStoryIndex: 0,
  journeyStoryLines: [],
  journeyStoryLastSlot: -1,
  focusTouchStartY: null,
  departureCountdownActive: false,
  departureCountdownTimer: null,
};

const wishPositions = [
  { left: 15, top: 31, label: "勇气" },
  { left: 37, top: 59, label: "松弛" },
  { left: 55, top: 28, label: "好奇" },
  { left: 72, top: 60, label: "陪伴" },
  { left: 87, top: 34, label: "明天" },
];

const defaultCompletionMessage =
  "今天找回了勇气、松弛、好奇、陪伴和明天。理想国度把它们收进暖光里，提醒你：愿望不用很大，也值得被认真看见。";

const catActions = [
  { title: "把今天放慢一点", kicker: "MOMENT 01" },
  { title: "跟着小猫巡游", kicker: "MOMENT 02" },
  { title: "灯暗了，小猫睡着了", kicker: "MOMENT 03" },
];

const windChimeDrag = {
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  pull: 0,
  threshold: 120,
  maxPull: 180,
  ready: false,
};

const journeyStoryTemplates = [
  "小猫把{item}别在地图角上，第一阵风就变得很听话。",
  "路边的雏菊轻轻点头，像在数你已经找回的 {wishes} 枚愿望。",
  "暖光集市的招牌亮了一小格，刚好照见一颗慢慢回来的勇气。",
  "{item}在背包里发出很轻的响声，小猫说这是出发的回音。",
  "有一朵云停在屋檐边，替你把刚才的犹豫晒得软软的。",
  "小猫绕过花杯，叼来一张空白车票，上面写着：今天可以慢一点。",
  "路灯把影子折成蝴蝶，飞到第 {step} 个小路口等你。",
  "一颗星星落进行囊，小猫假装没看见，其实尾巴已经翘起来了。",
  "集市尽头传来铃声，像有人替你把专注时间认真收好。",
  "风从书页里跑出来，帮你把下一枚愿望吹近了一点。"
];

const journeyIdleLine = "小猫把地图摊开，等你把第一颗勇气星星放进口袋。";
const journeyStartLine = "出发啦。番茄猫把指针轻轻拨响，花杯旁的小路醒了。";
const journeyEndLine = "抵达啦。小猫把这一段专注叠成便签，放进理想国度的花影里。";
const focusSceneNames = ["play", "meadow", "forest"];

function createParticles() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 23; i += 1) {
    const particle = document.createElement("span");
    const size = 3 + Math.random() * 10;

    particle.className = `particle${i % 5 === 0 ? " star" : ""}`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--duration", `${10 + Math.random() * 14}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 18}s`);
    particle.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    fragment.appendChild(particle);
  }

  particles.appendChild(fragment);
}

function setScene(name) {
  gameWorld.scrollTop = 0;
  gameWorld.scrollLeft = 0;
  document.body.dataset.scene = name;

  if (name !== "select") {
    closeItemsModal();
  }

  scenes.forEach((scene) => {
    const isActive = scene.dataset.scene === name;
    scene.classList.toggle("is-active", isActive);
    scene.setAttribute("aria-hidden", String(!isActive));
    scene.style.setProperty("opacity", isActive ? "1" : "0", "important");
    scene.style.setProperty("visibility", isActive ? "visible" : "hidden", "important");
    scene.style.setProperty("transform", isActive ? "scale(1)" : "scale(1.035)", "important");
  });

  state.currentScene = name;

  updateCompanionPlayback(name === "companion");
  updateMeadowPlayback(name === "meadow");
  updateForestPlayback(name === "forest");
  updatePlayVideo(name === "play");
  if (name !== "companion") resetWindChime();
  if (name !== "companion") closeCompanionCatDialog();
  if (name !== "companion") closeSettingsModal();
  if (name !== "companion") closeMoodModal();
}

function updatePlayVideo(shouldPlay) {
  if (!playBackgroundVideo) return;

  if (shouldPlay) {
    playBackgroundVideo.play().catch(() => {});
    return;
  }

  playBackgroundVideo.pause();
}

function updateCompanionPlayback(shouldPlay) {
  catActionVideos.forEach((video) => {
    if (shouldPlay && video.classList.contains("is-active")) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
  });
}

function setCatAction(index) {
  const actionIndex = Math.max(0, Math.min(catActions.length - 1, Number(index) || 0));
  const action = catActions[actionIndex];

  if (companionStage) companionStage.dataset.catAction = String(actionIndex);
  state.videoFadeTimers.forEach((timer) => window.clearTimeout(timer));
  state.videoFadeTimers = [];

  catActionVideos.forEach((video, videoIndex) => {
    const wasActive = video.classList.contains("is-active");
    const isActive = videoIndex === actionIndex;
    video.classList.toggle("is-active", isActive);
    video.setAttribute("aria-hidden", String(!isActive));

    if (isActive && state.currentScene === "companion") {
      video.play().catch(() => {});
    } else if (wasActive && state.currentScene === "companion") {
      video.play().catch(() => {});
      const fadeTimer = window.setTimeout(() => {
        if (!video.classList.contains("is-active")) video.pause();
      }, 620);
      state.videoFadeTimers.push(fadeTimer);
    } else {
      video.pause();
    }
  });

  if (catActionTitle) catActionTitle.textContent = action.title;
  if (catActionKicker) catActionKicker.textContent = action.kicker;

  playChime(587.33 + actionIndex * 70, 0.11);
}

function setWindChimePull(pull, sway = 0) {
  if (!companionWindChime) return;

  const progress = Math.min(1, pull / windChimeDrag.threshold);
  companionWindChime.style.setProperty("--chime-pull", `${pull.toFixed(1)}px`);
  companionWindChime.style.setProperty("--chime-sway", `${sway.toFixed(2)}deg`);
  companionWindChime.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
}

function resetWindChime() {
  if (!companionWindChime) return;

  windChimeDrag.active = false;
  windChimeDrag.pointerId = null;
  windChimeDrag.pull = 0;
  windChimeDrag.ready = false;
  companionWindChime.classList.remove("is-dragging", "is-ready", "is-triggered");
  setWindChimePull(0, 0);
}

function openCompanionCatDialog() {
  if (!companionCatDialog || state.currentScene !== "companion" || state.transitioning) return;

  window.clearTimeout(state.catDialogTimer);
  companionCatDialog.classList.add("is-open");
  companionCatDialog.setAttribute("aria-hidden", "false");
  state.catDialogTimer = window.setTimeout(closeCompanionCatDialog, 5000);
  playChime(739.99, 0.12);
}

function closeCompanionCatDialog() {
  if (!companionCatDialog) return;

  window.clearTimeout(state.catDialogTimer);
  state.catDialogTimer = null;
  companionCatDialog.classList.remove("is-open");
  companionCatDialog.setAttribute("aria-hidden", "true");
}

function setSettingsStatus(message) {
  if (!settingsStatus) return;

  settingsStatus.textContent = message;
}

function openSettingsModal() {
  if (!settingsModal || state.currentScene !== "companion" || state.transitioning) return;

  closeCompanionCatDialog();
  settingsModal.classList.add("is-open");
  settingsModal.setAttribute("aria-hidden", "false");
  setSettingsStatus("小猫会帮你守好今天的梦。");
  playChime(622.25, 0.12);
}

function closeSettingsModal() {
  if (!settingsModal) return;

  settingsModal.classList.remove("is-open");
  settingsModal.setAttribute("aria-hidden", "true");
}

function syncSoundControls() {
  if (backgroundMusic) {
    backgroundMusic.volume = state.soundVolume;
    backgroundMusic.muted = !state.soundOn || state.soundVolume <= 0;
  }

  if (soundToggle) {
    soundToggle.classList.toggle("sound-off", !state.soundOn);
    soundToggle.setAttribute("aria-label", state.soundOn ? "关闭声音" : "开启声音");
  }

  if (settingsVolume) settingsVolume.value = String(Math.round(state.soundVolume * 100));
  if (settingsVolumeValue) settingsVolumeValue.textContent = `${Math.round(state.soundVolume * 100)}%`;
}

function removeMusicUnlockListeners() {
  if (!state.musicUnlockBound) return;

  BACKGROUND_MUSIC_UNLOCK_EVENTS.forEach((eventName) => {
    window.removeEventListener(eventName, unlockBackgroundMusic);
  });
  state.musicUnlockBound = false;
}

function bindMusicUnlockListeners() {
  if (state.musicUnlockBound) return;

  BACKGROUND_MUSIC_UNLOCK_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, unlockBackgroundMusic, { once: true, passive: true });
  });
  state.musicUnlockBound = true;
}

function playBackgroundMusic() {
  if (!backgroundMusic || !state.soundOn || state.soundVolume <= 0) return;

  syncSoundControls();
  const playPromise = backgroundMusic.play();

  if (playPromise?.catch) {
    playPromise
      .then(removeMusicUnlockListeners)
      .catch(bindMusicUnlockListeners);
  }
}

function pauseBackgroundMusic() {
  if (!backgroundMusic) return;

  backgroundMusic.pause();
}

function unlockBackgroundMusic() {
  removeMusicUnlockListeners();
  playBackgroundMusic();
}

function updateSettingsVolume() {
  if (!settingsVolume) return;

  const value = Number(settingsVolume.value) || 0;
  state.soundVolume = Math.max(0, Math.min(1, value / 100));
  if (state.soundVolume > 0 && !state.soundOn) {
    state.soundOn = true;
  }
  syncSoundControls();

  if (state.soundOn && state.soundVolume > 0) {
    createAudioContext()?.resume();
    playBackgroundMusic();
    playChime(523.25 + state.soundVolume * 120, 0.08);
  } else {
    pauseBackgroundMusic();
  }
}

function handleSettingsAction(event) {
  const action = event.currentTarget.dataset.settingsAction;

  if (action === "switch") {
    setSettingsStatus("小猫正在把账号入口铺上软垫。");
    playChime(698.46, 0.13);
    return;
  }

  if (action === "logout") {
    setSettingsStatus("小猫已经把退出登录放进待确认的小窝。");
    playChime(440, 0.13);
  }
}

function openMoodModal() {
  if (!moodModal || state.currentScene !== "companion" || state.transitioning) return;

  closeCompanionCatDialog();
  moodModal.classList.add("is-open");
  moodModal.setAttribute("aria-hidden", "false");
  playChime(659.25, 0.12);
}

function closeMoodModal() {
  if (!moodModal) return;

  moodModal.classList.remove("is-open");
  moodModal.setAttribute("aria-hidden", "true");
}

function triggerWindChime() {
  if (!companionWindChime || state.transitioning || state.currentScene !== "companion") return;

  windChimeDrag.active = false;
  windChimeDrag.ready = false;
  companionWindChime.classList.remove("is-dragging", "is-ready");
  companionWindChime.classList.add("is-triggered");
  setWindChimePull(Math.min(windChimeDrag.pull || 24, windChimeDrag.threshold + 18), 0);
  playChime(783.99, 0.18);
  const currentAction = Number(companionStage?.dataset.catAction) || 0;
  setCatAction((currentAction + 1) % catActions.length);
  window.setTimeout(resetWindChime, 520);
}

function startWindChimeDrag(event) {
  if (
    !companionWindChime ||
    state.currentScene !== "companion" ||
    state.transitioning ||
    event.button > 0
  ) {
    return;
  }

  event.preventDefault();
  windChimeDrag.active = true;
  windChimeDrag.pointerId = event.pointerId;
  windChimeDrag.startX = event.clientX;
  windChimeDrag.startY = event.clientY;
  windChimeDrag.pull = 0;
  windChimeDrag.ready = false;
  windChimeDrag.maxPull = Math.max(145, Math.min(210, window.innerHeight * 0.27));
  windChimeDrag.threshold = windChimeDrag.maxPull * 0.64;
  companionWindChime.classList.add("is-dragging");
  companionWindChime.setPointerCapture?.(event.pointerId);
}

function moveWindChimeDrag(event) {
  if (
    !companionWindChime ||
    !windChimeDrag.active ||
    event.pointerId !== windChimeDrag.pointerId
  ) {
    return;
  }

  event.preventDefault();
  const rawPull = Math.max(0, event.clientY - windChimeDrag.startY);
  const pull =
    rawPull <= windChimeDrag.maxPull
      ? rawPull
      : windChimeDrag.maxPull + Math.sqrt(rawPull - windChimeDrag.maxPull) * 2.2;
  const horizontal = Math.max(-12, Math.min(12, (event.clientX - windChimeDrag.startX) * 0.09));
  const sway = horizontal + Math.sin(pull * 0.08) * 1.8;
  const isReady = pull >= windChimeDrag.threshold;

  if (isReady && !windChimeDrag.ready) {
    playChime(698.46, 0.08);
  }

  windChimeDrag.pull = pull;
  windChimeDrag.ready = isReady;
  companionWindChime.classList.toggle("is-ready", isReady);
  setWindChimePull(pull, sway);
}

function endWindChimeDrag(event) {
  if (
    !companionWindChime ||
    !windChimeDrag.active ||
    event.pointerId !== windChimeDrag.pointerId
  ) {
    return;
  }

  event.preventDefault();
  if (companionWindChime.hasPointerCapture?.(event.pointerId)) {
    companionWindChime.releasePointerCapture(event.pointerId);
  }
  companionWindChime.classList.remove("is-dragging");

  if (windChimeDrag.ready) {
    triggerWindChime();
    return;
  }

  windChimeDrag.active = false;
  windChimeDrag.pointerId = null;
  windChimeDrag.pull = 0;
  windChimeDrag.ready = false;
  companionWindChime.classList.remove("is-ready");
  setWindChimePull(0, 0);
}

function updateMeadowPlayback(shouldPlay) {
  if (!meadowVideo) return;

  if (shouldPlay) {
    meadowVideo.play().catch(() => {
      if (meadowVideoToggle) {
        meadowVideoToggle.classList.add("is-paused");
        meadowVideoToggle.setAttribute("aria-label", "播放视频");
        meadowVideoToggle.setAttribute("aria-pressed", "false");
      }
    });
    return;
  }

  meadowVideo.pause();
}

function syncMeadowVideoToggle() {
  if (!meadowVideo || !meadowVideoToggle) return;

  const isPlaying = !meadowVideo.paused;
  meadowVideoToggle.classList.toggle("is-paused", !isPlaying);
  meadowVideoToggle.setAttribute("aria-label", isPlaying ? "暂停视频" : "播放视频");
  meadowVideoToggle.setAttribute("aria-pressed", String(isPlaying));
}

function toggleMeadowVideo() {
  if (!meadowVideo) return;

  if (meadowVideo.paused) {
    meadowVideo.play().catch(() => {});
  } else {
    meadowVideo.pause();
  }

  syncMeadowVideoToggle();
}

function updateForestPlayback(shouldPlay) {
  if (!forestVideo) return;

  if (shouldPlay) {
    forestVideo.play().catch(() => {
      if (forestVideoToggle) {
        forestVideoToggle.classList.add("is-paused");
        forestVideoToggle.setAttribute("aria-label", "播放视频");
        forestVideoToggle.setAttribute("aria-pressed", "false");
      }
    });
    return;
  }

  forestVideo.pause();
}

function syncForestVideoToggle() {
  if (!forestVideo || !forestVideoToggle) return;

  const isPlaying = !forestVideo.paused;
  forestVideoToggle.classList.toggle("is-paused", !isPlaying);
  forestVideoToggle.setAttribute("aria-label", isPlaying ? "暂停视频" : "播放视频");
  forestVideoToggle.setAttribute("aria-pressed", String(isPlaying));
}

function toggleForestVideo() {
  if (!forestVideo) return;

  if (forestVideo.paused) {
    forestVideo.play().catch(() => {});
  } else {
    forestVideo.pause();
  }

  syncForestVideoToggle();
}

function updateForestInteraction(event) {
  if (state.currentScene !== "forest" || !forestInteraction || !forestCursorGlow || !forestCatResponse) return;
  if (event.target?.closest?.(".forest-controls, .forest-header")) return;

  const rect = forestInteraction.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const xRatio = x / Math.max(1, rect.width);
  const yRatio = y / Math.max(1, rect.height);

  forestCursorGlow.style.left = `${x}px`;
  forestCursorGlow.style.top = `${y}px`;
  forestInteraction.classList.add("is-cursor-near");
  window.clearTimeout(state.forestInteractTimer);
  state.forestInteractTimer = window.setTimeout(() => {
    forestInteraction.classList.remove("is-cursor-near");
  }, 900);

  const catX = rect.width * 0.43;
  const catY = rect.height * 0.58;
  const distance = Math.hypot(x - catX, y - catY);
  const isNearCat = distance < Math.min(rect.width, rect.height) * 0.22;

  forestInteraction.style.setProperty("--forest-x", xRatio.toFixed(3));
  forestInteraction.style.setProperty("--forest-y", yRatio.toFixed(3));
  forestInteraction.classList.toggle("is-cat-curious", isNearCat);

  if (isNearCat) {
    forestCatResponse.style.left = `${catX}px`;
    forestCatResponse.style.top = `${catY}px`;
  }
}

function openItemsModal() {
  if (!iwModal || state.transitioning) return;
  if (state.focusActive && state.currentScene === "select") {
    goToScene("play");
    return;
  }
  renderFocusPicker();
  iwModal.classList.add("iw-open");
  iwModal.setAttribute("aria-hidden", "false");
  playChime(587.33, 0.14);
}

function closeItemsModal() {
  if (!iwModal || state.departureCountdownActive) return;
  iwModal.classList.remove("iw-open");
  iwModal.setAttribute("aria-hidden", "true");
}

function getClampedFocusMinutes(minutes) {
  return Math.min(MAX_FOCUS_MINUTES, Math.max(MIN_FOCUS_MINUTES, Number(minutes) || state.focusMinutes));
}

function getFocusMinuteOptions() {
  const options = [];
  const half = Math.floor(FOCUS_PICKER_VISIBLE_COUNT / 2);

  for (let offset = -half; offset <= half; offset += 1) {
    const value = state.focusMinutes + offset;
    if (value >= MIN_FOCUS_MINUTES && value <= MAX_FOCUS_MINUTES) {
      options.push(value);
    }
  }

  while (options.length < FOCUS_PICKER_VISIBLE_COUNT && options[0] > MIN_FOCUS_MINUTES) {
    options.unshift(options[0] - 1);
  }

  while (options.length < FOCUS_PICKER_VISIBLE_COUNT && options[options.length - 1] < MAX_FOCUS_MINUTES) {
    options.push(options[options.length - 1] + 1);
  }

  return options;
}

function renderFocusPicker() {
  if (!focusMinuteWheel) return;

  focusMinuteWheel.innerHTML = "";
  focusMinuteWheel.setAttribute("aria-activedescendant", `focus-minute-option-${state.focusMinutes}`);

  getFocusMinuteOptions().forEach((minutes) => {
    const option = document.createElement("button");
    option.className = `iw-focus-picker__option${minutes === state.focusMinutes ? " is-selected" : ""}`;
    option.id = `focus-minute-option-${minutes}`;
    option.type = "button";
    option.dataset.focusMinutes = String(minutes);
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(minutes === state.focusMinutes));
    option.textContent = `${minutes} 分钟`;
    option.addEventListener("click", () => setFocusMinutes(minutes));
    focusMinuteWheel.appendChild(option);
  });

  if (focusMinuteValue) focusMinuteValue.textContent = String(state.focusMinutes);
  if (!state.focusActive) {
    updateFocusTimerHud();
  }
}

function setFocusMinutes(minutes) {
  if (state.departureCountdownActive) return;
  state.focusMinutes = getClampedFocusMinutes(minutes);
  renderFocusPicker();
  playChime(523.25 + state.focusMinutes * 2, 0.08);
}

function setItemsModalLocked(isLocked) {
  if (!iwModal) return;

  iwModal.classList.toggle("iw-counting-down", isLocked);
  iwModal.querySelectorAll("button").forEach((button) => {
    const isCountdownDisplay = button.closest(".iw-departure-countdown");
    if (!isCountdownDisplay) button.disabled = isLocked;
  });
}

function clearDepartureCountdown() {
  window.clearTimeout(state.departureCountdownTimer);
  state.departureCountdownTimer = null;
  state.departureCountdownActive = false;
  setItemsModalLocked(false);

  if (departureCountdown) {
    departureCountdown.classList.remove("is-visible", "is-popping");
    departureCountdown.setAttribute("aria-hidden", "true");
  }
}

function showDepartureStep(label, index) {
  if (!departureCountdown || !departureCountdownValue) return;

  departureCountdownValue.textContent = label;
  departureCountdown.style.setProperty("--count-step", String(index));
  departureCountdown.classList.toggle("is-word", label.length > 1);
  departureCountdown.classList.remove("is-popping");
  void departureCountdown.offsetWidth;
  departureCountdown.classList.add("is-visible", "is-popping");
  departureCountdown.setAttribute("aria-hidden", "false");
}

function startDepartureCountdown() {
  if (!iwModal || state.transitioning || state.departureCountdownActive) return;

  state.departureCountdownActive = true;
  setItemsModalLocked(true);

  const steps = ["3", "2", "1", "出发"];
  let index = 0;
  showDepartureStep(steps[index], index);
  playChime(587.33, 0.12);

  function nextStep() {
    index += 1;

    if (index < steps.length) {
      showDepartureStep(steps[index], index);
      playChime(index === steps.length - 1 ? 783.99 : 659.25, 0.12);
      state.departureCountdownTimer = window.setTimeout(nextStep, 780);
      return;
    }

    if (departureCountdown) {
      departureCountdown.classList.remove("is-visible");
      departureCountdown.setAttribute("aria-hidden", "true");
    }

    state.departureCountdownActive = false;
    setItemsModalLocked(false);
    iwModal.classList.remove("iw-open");
    iwModal.setAttribute("aria-hidden", "true");
    goToScene("play");
  }

  state.departureCountdownTimer = window.setTimeout(nextStep, 780);
}

function updateItemsProgress() {
  const count = state.packedItems.size;

  if (iwCount) {
    iwCount.textContent = String(count);
    iwCount.classList.remove("iw-num-pop");
    void iwCount.offsetWidth; // 强制重排，使数字跳动动画可重新触发
    iwCount.classList.add("iw-num-pop");
  }

  if (iwBtnGo) iwBtnGo.classList.toggle("iw-btn-go--ready", count > 0);
}

function getPackedItemsText(limit = 3) {
  const items = [...state.packedItems];
  if (items.length === 0) return "";

  const visibleItems = items.slice(0, limit).join("、");
  const rest = items.length > limit ? `等 ${items.length} 件小物` : "";
  return `${visibleItems}${rest}`;
}

function updatePackingNote() {
  if (!packingNote) return;

  const itemsText = getPackedItemsText();
  const noteText = itemsText ? `${itemsText} 正陪你找回愿望。` : "空空的背包也能出发。";
  packingNote.querySelector("p").textContent = noteText;
}

function updateCompletionMessage() {
  if (!completionMessage) return;

  const itemsText = getPackedItemsText(4);
  completionMessage.textContent = itemsText
    ? `你带着 ${itemsText}，找回了勇气、松弛、好奇、陪伴和明天。理想国度把这些小物和愿望放在同一张明信片里：原来照顾自己，也可以从一次很小的选择开始。`
    : defaultCompletionMessage;
}

function formatFocusTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getFocusProgress({ preserveRemaining = false } = {}) {
  const totalSeconds = Math.max(1, state.focusMinutes * 60);
  const remaining = state.focusActive || preserveRemaining ? state.focusRemainingSeconds : totalSeconds;
  return Math.max(0, Math.min(1, 1 - remaining / totalSeconds));
}

function updateMapTimerDial({ preserveRemaining = false } = {}) {
  if (!mapTomatoTimer) return;

  const progress = getFocusProgress({ preserveRemaining });
  const startAngle = 74;
  const endAngle = -74;
  const angle = state.focusActive || preserveRemaining || state.focusSessionEnded
    ? startAngle + (endAngle - startAngle) * progress
    : startAngle;

  mapTomatoTimer.style.setProperty("--map-dial-angle", `${angle.toFixed(2)}deg`);
  mapTomatoTimer.style.setProperty("--map-focus-progress", progress.toFixed(3));
}

function renderJourneyStories() {
  if (!mapJourneyStory) return;

  const lines = state.journeyStoryLines.length > 0 ? state.journeyStoryLines.slice(-3) : [journeyIdleLine];
  mapJourneyStory.innerHTML = "";
  lines.forEach((line, index) => {
    const paragraph = document.createElement("p");
    paragraph.style.setProperty("--story-index", String(index));
    paragraph.textContent = line;
    mapJourneyStory.appendChild(paragraph);
  });
}

function resetJourneyStories(line = journeyIdleLine) {
  state.journeyStoryIndex = 0;
  state.journeyStoryLastSlot = -1;
  state.journeyStoryLines = [line];
  renderJourneyStories();
}

function getJourneyStoryLine(slot) {
  const fallbackItem = state.packedItems.size > 0 ? getPackedItemsText(1) : "小背包";
  const template = journeyStoryTemplates[state.journeyStoryIndex % journeyStoryTemplates.length];
  state.journeyStoryIndex += 1;

  return template
    .replaceAll("{item}", fallbackItem)
    .replaceAll("{wishes}", String(state.wishes))
    .replaceAll("{step}", String(Math.max(1, slot + 1)));
}

function updateJourneyStory({ force = false, finalLine = "" } = {}) {
  if (!mapJourneyStory) return;

  if (finalLine) {
    state.journeyStoryLines = [finalLine];
    renderJourneyStories();
    return;
  }

  if (!state.focusActive) {
    if (state.journeyStoryLines.length === 0) resetJourneyStories();
    return;
  }

  const totalSeconds = Math.max(1, state.focusMinutes * 60);
  const elapsedSeconds = Math.max(0, totalSeconds - state.focusRemainingSeconds);
  const storyInterval = Math.max(10, Math.min(90, Math.round(totalSeconds / 6)));
  const currentSlot = Math.floor(elapsedSeconds / storyInterval);

  if (!force && currentSlot === state.journeyStoryLastSlot) return;

  state.journeyStoryLastSlot = currentSlot;
  state.journeyStoryLines.push(currentSlot === 0 ? journeyStartLine : getJourneyStoryLine(currentSlot));
  state.journeyStoryLines = state.journeyStoryLines.slice(-3);
  renderJourneyStories();
}

function updateFocusTimerHud({ preserveRemaining = false } = {}) {
  const totalSeconds = state.focusMinutes * 60;
  const remaining = state.focusActive || preserveRemaining ? state.focusRemainingSeconds : totalSeconds;
  const isWarm = state.focusActive && remaining <= totalSeconds * 0.2;
  const isEnding = state.focusActive && remaining <= 10;
  const timerText = formatFocusTime(remaining);
  const statusText = state.focusActive ? "专注中" : state.focusSessionEnded ? "已抵达" : "待启程";

  [...focusTimerDisplays, mapTimerDisplay].filter(Boolean).forEach((display) => {
    display.textContent = timerText;
  });

  [...focusTimerChips, mapTomatoTimer].filter(Boolean).forEach((chip) => {
    chip.classList.toggle("is-active", state.focusActive);
    chip.classList.toggle("is-warm", isWarm);
    chip.classList.toggle("is-ending", isEnding);
    chip.classList.toggle("is-ended", !state.focusActive && state.focusSessionEnded);
  });

  focusTimerChips.forEach((chip) => {
    chip.setAttribute("aria-label", `专注倒计时：${timerText}`);
  });

  if (mapTimerStatus) {
    mapTimerStatus.textContent = statusText;
  }

  if (mapTomatoTimer) {
    mapTomatoTimer.setAttribute("aria-label", `地图专注倒计时：${statusText}，${timerText}`);
  }

  updateMapTimerDial({ preserveRemaining });
  updateJourneyStory();
}

function stopFocusTimer({ preserveRemaining = false } = {}) {
  window.clearInterval(state.focusTimerId);
  state.focusTimerId = null;
  state.focusActive = false;
  if (!preserveRemaining && !state.focusSessionEnded) {
    resetJourneyStories();
  }
  updateFocusTimerHud({ preserveRemaining });
}

function startFocusTimer(minutes = state.focusMinutes) {
  stopFocusTimer();
  state.focusMinutes = getClampedFocusMinutes(minutes);
  state.focusRemainingSeconds = state.focusMinutes * 60;
  state.focusActive = true;
  state.focusSessionEnded = false;
  state.focusResultVisible = false;
  resetJourneyStories(journeyStartLine);
  state.journeyStoryLastSlot = 0;
  updateFocusTimerHud();

  state.focusTimerId = window.setInterval(() => {
    state.focusRemainingSeconds = Math.max(0, state.focusRemainingSeconds - 1);
    updateFocusTimerHud();

    if (state.focusRemainingSeconds <= 0) {
      finishFocusSession();
    }
  }, 1000);
}

function ensureFocusTimerRunning({ resetPlay = false } = {}) {
  if (state.focusActive) {
    updateFocusTimerHud({ preserveRemaining: true });
    return;
  }

  if (resetPlay) resetGame();
  startFocusTimer(state.focusMinutes);
}

function updateFocusResultMessage() {
  if (!focusResultMessage || !focusResultItems) return;

  focusResultMessage.textContent = `你在理想国度停留了 ${state.focusMinutes} 分钟，找回了 ${state.wishes} / ${state.totalWishes} 枚愿望。`;

  const itemsText = getPackedItemsText(4);
  focusResultItems.textContent = itemsText
    ? `这次陪你抵达的是：${itemsText}。`
    : "空空的背包也陪你抵达了这里。";
}

function finishFocusSession() {
  if (state.focusResultVisible || state.wishes >= state.totalWishes) return;

  const shouldRevealPlayScene = state.currentScene === "select";

  state.focusRemainingSeconds = 0;
  state.focusSessionEnded = true;
  stopFocusTimer({ preserveRemaining: true });
  state.focusResultVisible = true;
  updateJourneyStory({ finalLine: journeyEndLine });
  if (guideBubble) guideBubble.classList.add("is-hidden");
  if (playTip) playTip.textContent = "这一段专注抵达终点，小猫正在收好回信。";
  updateFocusResultMessage();

  if (shouldRevealPlayScene) {
    setScene("play");
  }

  if (focusResultCard) {
    focusResultCard.classList.add("is-visible");
    focusResultCard.setAttribute("aria-hidden", "false");
  }

  playSuccessChord();
}

function hideFocusResultCard({ action = "close" } = {}) {
  if (focusResultCard) {
    focusResultCard.classList.remove("is-visible");
    focusResultCard.setAttribute("aria-hidden", "true");
  }

  state.focusResultVisible = false;

  if (action === "restart") {
    resetGame();
    startFocusTimer(state.focusMinutes);
    return;
  }

  if (action === "home") {
    state.focusSessionEnded = false;
    stopFocusTimer();
    goToScene("select");
  }
}

function toggleItem(item) {
  if (state.departureCountdownActive) return;

  const itemName = item.querySelector(".iw-item__name")?.textContent.trim() || "";
  const isSelected = item.classList.toggle("iw-selected");
  item.setAttribute("aria-pressed", String(isSelected));

  if (isSelected) {
    state.packedItems.add(itemName);
    playChime(698.46 + state.packedItems.size * 35, 0.14);
  } else {
    state.packedItems.delete(itemName);
    playChime(440, 0.1);
  }

  updateItemsProgress();
}

function goToScene(name) {
  if (!name || state.transitioning) return false;
  if (name === state.currentScene) return true;

  if (![...focusSceneNames, "select"].includes(name)) {
    stopFocusTimer();
  }

  state.transitioning = true;
  transition.classList.add("is-transitioning");
  playChime(523.25, 0.12);

  window.setTimeout(() => {
    setScene(name);

    if (focusSceneNames.includes(name)) {
      ensureFocusTimerRunning({ resetPlay: name === "play" });
    }
  }, 520);

  window.setTimeout(() => {
    transition.classList.remove("is-transitioning");
    state.transitioning = false;
  }, 1120);

  return true;
}

function finishIntro() {
  if (state.introFinished) return;
  state.introFinished = true;
  loadingProgress.style.width = "100%";
  loadingCopy.textContent = "梦境已抵达";

  window.setTimeout(() => {
    document.querySelector("#scene-loading").style.zIndex = "2";
    setScene("title");
  }, 420);
}

function runIntro() {
  const start = performance.now();
  const duration = 3000;
  const messages = [
    { point: 0, text: "正在把梦吹亮..." },
    { point: 34, text: "正在收集云朵..." },
    { point: 68, text: "正在唤醒暖光集市..." },
  ];

  function tick(now) {
    if (state.introFinished) return;

    const progress = Math.min(100, ((now - start) / duration) * 100);
    loadingProgress.style.width = `${progress}%`;
    const message = [...messages].reverse().find((item) => progress >= item.point) || messages[0];
    loadingCopy.textContent = message.text;

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      finishIntro();
    }
  }

  requestAnimationFrame(tick);
}

function buildWishDots() {
  wishDots.innerHTML = "";

  for (let i = 0; i < state.totalWishes; i += 1) {
    const dot = document.createElement("i");
    dot.className = `wish-dot${i < state.wishes ? " is-filled" : ""}`;
    wishDots.appendChild(dot);
  }
}

function buildWishes() {
  wishField.innerHTML = "";

  wishPositions.forEach((position, index) => {
    const wish = document.createElement("button");
    wish.className = "wish";
    wish.type = "button";
    wish.dataset.wish = String(index);
    wish.setAttribute("aria-label", `收集愿望：${position.label}`);
    wish.style.left = `${position.left}%`;
    wish.style.top = `${position.top}%`;
    wish.style.setProperty("--float-time", `${2.3 + index * 0.24}s`);
    wish.style.setProperty("--float-delay", `${index * -0.36}s`);
    wish.innerHTML = "<span>✦</span>";
    wish.addEventListener("click", () => collectWish(wish, position.label));
    wishField.appendChild(wish);
  });
}

function collectWish(wish, label) {
  if (wish.classList.contains("is-collected") || state.focusResultVisible || state.focusSessionEnded) return;

  wish.classList.add("is-collected");
  state.wishes += 1;
  wishCount.textContent = String(state.wishes);
  buildWishDots();
  playChime(660 + state.wishes * 70, 0.18);

  const pop = document.createElement("span");
  pop.className = "wish-pop";
  pop.textContent = `找回「${label}」`;
  pop.style.left = wish.style.left;
  pop.style.top = wish.style.top;
  wishField.appendChild(pop);
  window.setTimeout(() => pop.remove(), 950);

  const dreamCount = document.querySelector(".dream-count");
  dreamCount.innerHTML = `<span>✦</span> ${state.wishes} / ${state.totalWishes}`;

  if (state.wishes === state.totalWishes) {
    stopFocusTimer({ preserveRemaining: true });
    updateJourneyStory({ finalLine: "五枚愿望都回来了。小猫把花瓣当作邮票，替你盖上今天的抵达章。" });
    completeGame();
  } else if (state.wishes === 1) {
    guideBubble.classList.add("is-hidden");
    playTip.textContent = "找到了。还有 4 枚愿望躲在岛上。";
  } else {
    playTip.textContent = `岛正在变亮，还差 ${state.totalWishes - state.wishes} 枚。`;
  }
}

function completeGame() {
  const playScene = document.querySelector("#scene-play");
  state.focusSessionEnded = true;
  updateFocusTimerHud({ preserveRemaining: true });
  playScene.classList.add("is-complete");
  playTip.textContent = "暖光集市记住了你的愿望。";
  updateCompletionMessage();

  window.setTimeout(() => {
    completionCard.classList.add("is-visible");
    completionCard.setAttribute("aria-hidden", "false");
    playSuccessChord();
  }, 650);
}

function resetGame() {
  state.wishes = 0;
  state.focusSessionEnded = false;
  state.focusResultVisible = false;
  if (!state.focusActive) resetJourneyStories();
  wishCount.textContent = "0";
  document.querySelector(".dream-count").innerHTML = "<span>✦</span> 0 / 5";
  document.querySelector("#scene-play").classList.remove("is-complete");
  completionCard.classList.remove("is-visible");
  completionCard.setAttribute("aria-hidden", "true");
  if (focusResultCard) {
    focusResultCard.classList.remove("is-visible");
    focusResultCard.setAttribute("aria-hidden", "true");
  }
  guideBubble.classList.remove("is-hidden");
  updatePackingNote();
  playTip.textContent =
    state.packedItems.size > 0
      ? `背包已装好：${getPackedItemsText(4)}。现在去找愿望吧。`
      : "移动小鱼，猫咪会陪你一起寻找。";
  buildWishDots();
  buildWishes();
  updateFocusTimerHud();
}

function createAudioContext() {
  if (state.audioContext) return state.audioContext;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  state.audioContext = new AudioContext();
  return state.audioContext;
}

function playChime(frequency = 523.25, duration = 0.14) {
  if (!state.soundOn || state.soundVolume <= 0) return;

  const audio = createAudioContext();
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const now = audio.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.012, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.075 * state.soundVolume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playSuccessChord() {
  [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
    window.setTimeout(() => playChime(note, 0.55), index * 120);
  });
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  syncSoundControls();

  if (state.soundOn) {
    createAudioContext()?.resume();
    playBackgroundMusic();
    playChime(523.25, 0.18);
  } else {
    pauseBackgroundMusic();
    removeMusicUnlockListeners();
  }
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    fullscreenToggle.animate(
      [{ transform: "translateX(-2px)" }, { transform: "translateX(2px)" }, { transform: "translateX(0)" }],
      { duration: 220 },
    );
  }
}

function createTouchRipple(clientX, clientY) {
  const rect = gameWorld.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;

  const ripple = document.createElement("span");
  ripple.className = "touch-ripple";
  ripple.style.left = `${clientX - rect.left}px`;
  ripple.style.top = `${clientY - rect.top}px`;
  touchRipples.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 700);
}

function updateCursor() {
  state.fish.x += (state.cursor.x - state.fish.x) * 0.38;
  state.fish.y += (state.cursor.y - state.fish.y) * 0.38;
  state.cat.x += (state.fish.x - 34 - state.cat.x) * 0.085;
  state.cat.y += (state.fish.y + 10 - state.cat.y) * 0.085;

  const direction = state.fish.x >= state.cat.x ? 1 : -1;
  fishCursor.style.transform = `translate3d(${state.fish.x - 16}px, ${state.fish.y - 11}px, 0) scaleX(${direction})`;
  catCursor.style.transform = `translate3d(${state.cat.x - 22}px, ${state.cat.y - 17}px, 0) scaleX(${direction})`;
  cursorAura.style.left = `${state.cursor.x}px`;
  cursorAura.style.top = `${state.cursor.y}px`;

  requestAnimationFrame(updateCursor);
}

function updateParallax(event) {
  if (state.currentScene === "loading") return;

  const x = (event.clientX / innerWidth - 0.5) * 2;
  const y = (event.clientY / innerHeight - 0.5) * 2;
  gameWorld.style.setProperty("--pointer-x", x.toFixed(3));
  gameWorld.style.setProperty("--pointer-y", y.toFixed(3));

  if (rewardTreeStage) {
    rewardTreeStage.style.setProperty("--reward-sway-x", `${(x * 34).toFixed(2)}px`);
    rewardTreeStage.style.setProperty("--reward-sway-y", `${(y * 16).toFixed(2)}px`);
    rewardTreeStage.style.setProperty("--reward-tilt", `${(x * 18).toFixed(2)}deg`);
    rewardCoins.forEach((coin) => {
      const weight = Number(coin.dataset.coinWeight) || 0.8;
      coin.style.setProperty("--coin-sway-x", `${(x * 34 * weight).toFixed(2)}px`);
      coin.style.setProperty("--coin-sway-y", `${(y * 16 * weight).toFixed(2)}px`);
      coin.style.setProperty("--coin-tilt", `${(x * 18 * weight).toFixed(2)}deg`);
    });
  }

  const activeBackdrop =
    state.currentScene === "play"
      ? document.querySelector(".play-backdrop")
      : document.querySelector(".painted-sky");

  if (activeBackdrop) {
    const scale = state.currentScene === "play" ? 1.16 : 1.06;
    activeBackdrop.style.transform = `scale(${scale}) translate3d(${x * -0.55}%, ${y * -0.45}%, 0)`;
  }
}

document.addEventListener("pointermove", (event) => {
  state.cursor.x = event.clientX;
  state.cursor.y = event.clientY;
  cursorAura.classList.remove("is-idle");
  window.clearTimeout(state.idleTimer);
  state.idleTimer = window.setTimeout(() => cursorAura.classList.add("is-idle"), 520);
  updateParallax(event);
});

document.addEventListener("pointerdown", (event) => {
  createTouchRipple(event.clientX, event.clientY);
});

skipIntro.addEventListener("click", finishIntro);
startButton.addEventListener("click", () => goToScene("companion"));
if (companionWindChime) {
  companionWindChime.addEventListener("pointerdown", startWindChimeDrag);
  window.addEventListener("pointermove", moveWindChimeDrag, { passive: false });
  window.addEventListener("pointerup", endWindChimeDrag);
  window.addEventListener("pointercancel", endWindChimeDrag);
  companionWindChime.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    triggerWindChime();
  });
  companionWindChime.addEventListener("click", (event) => {
    if (event.detail === 0 || windChimeDrag.pull > 0) return;
    event.preventDefault();
    triggerWindChime();
  });
}
if (moodButton) {
  moodButton.addEventListener("click", openMoodModal);
}
if (companionCatHotspot) {
  companionCatHotspot.addEventListener("click", openCompanionCatDialog);
}
if (companionCatDialogClose) {
  companionCatDialogClose.addEventListener("click", closeCompanionCatDialog);
}
if (settingsButton) {
  settingsButton.addEventListener("click", openSettingsModal);
}
if (settingsModal) {
  settingsModal.querySelectorAll("[data-settings-close]").forEach((button) => {
    button.addEventListener("click", closeSettingsModal);
  });
  settingsModal.querySelectorAll("[data-settings-action]").forEach((button) => {
    button.addEventListener("click", handleSettingsAction);
  });
}
if (settingsVolume) {
  settingsVolume.value = String(Math.round(state.soundVolume * 100));
  if (settingsVolumeValue) settingsVolumeValue.textContent = `${Math.round(state.soundVolume * 100)}%`;
  settingsVolume.addEventListener("input", updateSettingsVolume);
}
if (moodModal) {
  moodModal.querySelectorAll("[data-mood-close]").forEach((button) => {
    button.addEventListener("click", closeMoodModal);
  });
}
archiveItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("is-locked")) return;
    archiveItems.forEach((archiveItem) => archiveItem.classList.toggle("is-selected", archiveItem === item));
    playChime(587.33, 0.08);
  });
});
diaryCards.forEach((card) => {
  card.addEventListener("click", () => {
    diaryCards.forEach((diaryCard) => diaryCard.classList.toggle("is-selected", diaryCard === card));
    playChime(659.25, 0.08);
  });
});
soundToggle.addEventListener("click", toggleSound);
fullscreenToggle.addEventListener("click", toggleFullscreen);
candyEntrances.forEach((entrance) => {
  entrance.addEventListener("click", openItemsModal);
});
if (meadowRealm) meadowRealm.addEventListener("click", () => goToScene("meadow"));
if (meadowVideoToggle) meadowVideoToggle.addEventListener("click", toggleMeadowVideo);
if (meadowVideo) {
  meadowVideo.addEventListener("play", syncMeadowVideoToggle);
  meadowVideo.addEventListener("pause", syncMeadowVideoToggle);
  meadowVideo.addEventListener("ended", syncMeadowVideoToggle);
}
if (forestRealm) forestRealm.addEventListener("click", () => goToScene("forest"));
if (forestVideoToggle) forestVideoToggle.addEventListener("click", toggleForestVideo);
if (forestVideo) {
  forestVideo.addEventListener("play", syncForestVideoToggle);
  forestVideo.addEventListener("pause", syncForestVideoToggle);
  forestVideo.addEventListener("ended", syncForestVideoToggle);
}
if (forestInteraction) {
  forestInteraction.addEventListener("pointermove", updateForestInteraction);
  forestInteraction.addEventListener("pointerdown", updateForestInteraction);
}
document.addEventListener("pointermove", updateForestInteraction);
document.addEventListener("pointerdown", updateForestInteraction);

if (iwModal) {
  iwModal.querySelectorAll("[data-iw-close]").forEach((el) => {
    el.addEventListener("click", closeItemsModal);
  });
  iwItems.forEach((item) => {
    item.addEventListener("click", () => toggleItem(item));
  });
}
if (iwBtnGo) {
  iwBtnGo.addEventListener("click", startDepartureCountdown);
}
if (focusMinuteUp) {
  focusMinuteUp.addEventListener("click", () => setFocusMinutes(state.focusMinutes + 1));
}
if (focusMinuteDown) {
  focusMinuteDown.addEventListener("click", () => setFocusMinutes(state.focusMinutes - 1));
}
if (focusMinuteWheel) {
  focusMinuteWheel.addEventListener("wheel", (event) => {
    event.preventDefault();
    setFocusMinutes(state.focusMinutes + (event.deltaY > 0 ? -1 : 1));
  }, { passive: false });

  focusMinuteWheel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusMinutes(state.focusMinutes + 1);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusMinutes(state.focusMinutes - 1);
    }
  });

  focusMinuteWheel.addEventListener("pointerdown", (event) => {
    state.focusTouchStartY = event.clientY;
  });

  focusMinuteWheel.addEventListener("pointerup", (event) => {
    if (state.focusTouchStartY === null) return;
    const deltaY = event.clientY - state.focusTouchStartY;
    state.focusTouchStartY = null;

    if (Math.abs(deltaY) > 16) {
      setFocusMinutes(state.focusMinutes + (deltaY < 0 ? 1 : -1));
    }
  });
}
closeGuide.addEventListener("click", () => guideBubble.classList.add("is-hidden"));
completionClose.addEventListener("click", () => {
  completionCard.classList.remove("is-visible");
  completionCard.setAttribute("aria-hidden", "true");
});
replayButton.addEventListener("click", resetGame);
if (focusResultClose) focusResultClose.addEventListener("click", () => hideFocusResultCard());
if (focusResultAgain) focusResultAgain.addEventListener("click", () => hideFocusResultCard({ action: "restart" }));
if (focusResultHome) focusResultHome.addEventListener("click", () => hideFocusResultCard({ action: "home" }));
if (backgroundMusic) {
  backgroundMusic.addEventListener("canplay", playBackgroundMusic, { once: true });
  backgroundMusic.addEventListener("error", removeMusicUnlockListeners);
}

function findNavigationTrigger(event) {
  const directTrigger = event.target.closest?.("[data-go]");

  if (directTrigger) return directTrigger;

  const stackedElements = document.elementsFromPoint?.(event.clientX, event.clientY) || [];

  for (const element of stackedElements) {
    const trigger = element.closest?.("[data-go]");

    if (trigger && trigger.closest(".scene.is-active")) return trigger;
  }

  return null;
}

document.addEventListener("click", (event) => {
  const trigger = findNavigationTrigger(event);

  if (!trigger) return;

  const targetScene = trigger.dataset.go;
  const hasScene = targetScene && scenes.some((scene) => scene.dataset.scene === targetScene);

  if (!hasScene) return;

  event.preventDefault();
  const didStartTransition = goToScene(targetScene);

  if (!didStartTransition && trigger.href) {
    window.location.href = trigger.href;
  }
}, true);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.departureCountdownActive) {
    return;
  }

  if (event.key === "Escape" && focusResultCard && focusResultCard.classList.contains("is-visible")) {
    hideFocusResultCard();
    return;
  }

  if (event.key === "Escape" && companionCatDialog && companionCatDialog.classList.contains("is-open")) {
    closeCompanionCatDialog();
    return;
  }

  if (event.key === "Escape" && settingsModal && settingsModal.classList.contains("is-open")) {
    closeSettingsModal();
    return;
  }

  if (event.key === "Escape" && moodModal && moodModal.classList.contains("is-open")) {
    closeMoodModal();
    return;
  }

  if (event.key === "Escape" && iwModal && iwModal.classList.contains("iw-open")) {
    closeItemsModal();
    return;
  }

  if (event.key === "Escape" && completionCard.classList.contains("is-visible")) {
    completionCard.classList.remove("is-visible");
    completionCard.setAttribute("aria-hidden", "true");
  }
});

createParticles();
buildWishDots();
buildWishes();
updateItemsProgress();
renderFocusPicker();
updateFocusTimerHud();
resetWindChime();
syncSoundControls();
playBackgroundMusic();
const initialScene = new URLSearchParams(window.location.search).get("scene") || window.location.hash.slice(1);

if (initialScene && scenes.some((scene) => scene.dataset.scene === initialScene)) {
  state.introFinished = true;
  loadingProgress.style.width = "100%";
  setScene(initialScene);
  if (focusSceneNames.includes(initialScene)) {
    ensureFocusTimerRunning({ resetPlay: initialScene === "play" });
  }
} else {
  runIntro();
}
updateCursor();
