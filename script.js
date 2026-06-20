const pages = [...document.querySelectorAll(".page")];
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const indicator = document.querySelector("#page-indicator");
const postcardStage = document.querySelector(".postcard-stage");
const postcardInner = document.querySelector(".postcard__inner");
const desktopLayoutQuery = window.matchMedia("(min-width: 981px) and (hover: hover) and (pointer: fine)");

const desktopCanvas = { width: 1500, height: 843.75 };

let currentPage = 0;
let resizeFrame = 0;

function updateDesktopScale() {
  if (!desktopLayoutQuery.matches) {
    postcardStage.style.removeProperty("--desktop-stage-width");
    postcardStage.style.removeProperty("--desktop-stage-height");
    postcardStage.style.removeProperty("--desktop-scale");
    return;
  }

  const bodyStyle = getComputedStyle(document.body);
  const horizontalPadding = parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);
  const verticalPadding = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
  const availableWidth = Math.max(1, window.innerWidth - horizontalPadding);
  const availableHeight = Math.max(1, window.innerHeight - verticalPadding);
  const scale = Math.min(
    1,
    availableWidth / desktopCanvas.width,
    availableHeight / desktopCanvas.height,
  );

  postcardStage.style.setProperty("--desktop-scale", String(scale));
  postcardStage.style.setProperty("--desktop-stage-width", `${desktopCanvas.width * scale}px`);
  postcardStage.style.setProperty("--desktop-stage-height", `${desktopCanvas.height * scale}px`);
}

function scheduleDesktopScale() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(updateDesktopScale);
}

function resetScrollPosition() {
  const documentScroller = document.scrollingElement || document.documentElement;

  postcardInner.scrollTop = 0;
  postcardInner.scrollLeft = 0;
  documentScroller.scrollTop = 0;
  documentScroller.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
  window.scrollTo(0, 0);
}

function applyContent() {
  Object.entries(window.postcardContent || {}).forEach(([pageNumber, content]) => {
    const page = document.querySelector(`[data-page="${pageNumber}"]`);
    if (!page) return;

    page.querySelectorAll("[data-content]").forEach((element) => {
      const value = content[element.dataset.content];
      if (typeof value === "string") element.textContent = value;
    });

    const factList = page.querySelector('[data-content-list="facts"]');
    if (factList && Array.isArray(content.facts)) {
      factList.replaceChildren(...content.facts.map((fact) => {
        const item = document.createElement("li");
        item.textContent = fact;
        return item;
      }));
    }

    page.querySelectorAll("[data-caption]").forEach((caption) => {
      const value = content.captions?.[Number(caption.dataset.caption)];
      if (typeof value === "string") caption.textContent = value;
    });

    page.querySelectorAll("[data-photo]").forEach((slot) => {
      const photo = content.photos?.[Number(slot.dataset.photo)];
      if (!photo?.src) return;

      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt || "爱好照片";
      image.loading = "lazy";
      image.decoding = "async";
      image.style.width = "100%";
      image.style.height = "100%";
      image.style.objectFit = "fill";
      image.style.setProperty("--photo-position", photo.position || "50% 50%");
      image.style.setProperty("--photo-scale", String(photo.scale || 1));
      slot.classList.add("has-photo");
      slot.replaceChildren(image);
    });
  });
}

function showPage(index) {
  currentPage = (index + pages.length) % pages.length;

  pages.forEach((page, pageIndex) => {
    const isActive = pageIndex === currentPage;
    page.hidden = !isActive;
    page.classList.toggle("is-active", isActive);
  });

  indicator.value = `${String(currentPage + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  document.title = `个人明信片 · ${currentPage + 1}/${pages.length}`;

  requestAnimationFrame(resetScrollPosition);
}

previousButton.addEventListener("click", () => showPage(currentPage - 1));
nextButton.addEventListener("click", () => showPage(currentPage + 1));
window.addEventListener("resize", scheduleDesktopScale);

if (desktopLayoutQuery.addEventListener) {
  desktopLayoutQuery.addEventListener("change", scheduleDesktopScale);
} else {
  desktopLayoutQuery.addListener(scheduleDesktopScale);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showPage(currentPage - 1);
  if (event.key === "ArrowRight") showPage(currentPage + 1);
});

applyContent();
updateDesktopScale();
showPage(0);
