const pages = [...document.querySelectorAll(".page")];
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const indicator = document.querySelector("#page-indicator");

let currentPage = 0;

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
}

previousButton.addEventListener("click", () => showPage(currentPage - 1));
nextButton.addEventListener("click", () => showPage(currentPage + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showPage(currentPage - 1);
  if (event.key === "ArrowRight") showPage(currentPage + 1);
});

applyContent();
showPage(0);
