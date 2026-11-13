function initBlogFilter() {
  const listContainer = document.getElementById("blog-posts-list");
  if (!listContainer) return;

  const cards = Array.from(
    listContainer.querySelectorAll<HTMLElement>("[data-post-card]")
  );
  const postSearchInput = document.getElementById("post-search-input") as HTMLInputElement | null;
  const tagSearchInput = document.getElementById("tag-search-input") as HTMLInputElement | null;
  const noTagsMsg = document.getElementById("no-tags-msg");

  const typeBtns = document.querySelectorAll<HTMLButtonElement>("[data-filter-type]");
  const tagBtns = document.querySelectorAll<HTMLButtonElement>("[data-filter-tag]");
  const extraTagBtns = document.querySelectorAll<HTMLButtonElement>("[data-extra-tag]");
  const toggleTagsBtn = document.getElementById("toggle-tags-btn") as HTMLButtonElement | null;
  const toggleTagsText = document.getElementById("toggle-tags-text");
  const toggleTagsIcon = document.getElementById("toggle-tags-icon");
  const clearTagsBtn = document.getElementById("clear-tags-btn") as HTMLButtonElement | null;

  const emptyState = document.getElementById("blog-empty-state");
  const paginationNav = document.getElementById("blog-pagination");
  const prevBtn = document.getElementById("blog-page-prev") as HTMLButtonElement | null;
  const nextBtn = document.getElementById("blog-page-next") as HTMLButtonElement | null;
  const pageIndicator = document.getElementById("blog-page-indicator");

  const pageSize = Number(listContainer.dataset.pageSize) || 5;

  let activeType: "all" | "project" | "tournament" = "all";
  const activeTags = new Set<string>();
  let postQuery = "";
  let tagQuery = "";
  let tagsExpanded = false;
  let currentPage = 1;

  const params = new URLSearchParams(window.location.search);
  const paramType = params.get("type");
  const paramTags = params.getAll("tag").flatMap((t) => t.split(","));
  const paramQuery = params.get("q")?.trim().toLowerCase();

  if (paramType === "project" || paramType === "tournament") {
    activeType = paramType;
  }

  paramTags.forEach((t) => {
    const clean = t.trim().toLowerCase();
    if (clean) activeTags.add(clean);
  });

  if (paramQuery && postSearchInput) {
    postQuery = paramQuery;
    postSearchInput.value = paramQuery;
  }

  extraTagBtns.forEach((btn) => {
    const tag = btn.dataset.filterTag;
    if (tag && activeTags.has(tag)) {
      tagsExpanded = true;
    }
  });

  function syncTagsVisibility() {
    let visibleCount = 0;
    const isSearchingTags = tagQuery.length > 0;

    tagBtns.forEach((btn) => {
      const tag = btn.dataset.filterTag || "";
      const isExtra = btn.hasAttribute("data-extra-tag");
      const isSelected = activeTags.has(tag);

      const isVisible = isSearchingTags
        ? tag.includes(tagQuery)
        : !isExtra || tagsExpanded || isSelected;

      if (isVisible) visibleCount++;
      btn.classList.toggle("inline-flex", isVisible);
      btn.classList.toggle("hidden", !isVisible);
    });

    if (noTagsMsg) {
      noTagsMsg.classList.toggle("hidden", visibleCount > 0);
    }

    if (toggleTagsBtn && toggleTagsText && toggleTagsIcon) {
      const hiddenCount = Number(toggleTagsBtn.dataset.hiddenCount) || 0;
      const showToggleBtn = !isSearchingTags && hiddenCount > 0;

      toggleTagsBtn.classList.toggle("inline-flex", showToggleBtn);
      toggleTagsBtn.classList.toggle("hidden", !showToggleBtn);
      toggleTagsBtn.setAttribute("aria-expanded", String(tagsExpanded));
      const moreTemplate = toggleTagsBtn.dataset.moreTemplate || "+{count} more";
      const showLessLabel = toggleTagsBtn.dataset.showLess || "Show less";
      toggleTagsText.textContent = tagsExpanded
        ? showLessLabel
        : moreTemplate.replace("{count}", String(hiddenCount));
      toggleTagsIcon.classList.toggle("rotate-180", tagsExpanded);
    }
  }

  function syncFilterButtonsUI() {
    typeBtns.forEach((b) => {
      const isCurrent = b.dataset.filterType === activeType;
      b.toggleAttribute("data-active", isCurrent);
      b.setAttribute("aria-pressed", String(isCurrent));
    });

    tagBtns.forEach((b) => {
      const tag = b.dataset.filterTag || "";
      const isCurrent = activeTags.has(tag);
      b.toggleAttribute("data-active", isCurrent);
      b.setAttribute("aria-pressed", String(isCurrent));
    });

    if (clearTagsBtn) {
      const hasActiveTags = activeTags.size > 0;
      clearTagsBtn.classList.toggle("inline-flex", hasActiveTags);
      clearTagsBtn.classList.toggle("hidden", !hasActiveTags);
    }

    syncTagsVisibility();
  }

  function render() {
    const selectedTagsList = Array.from(activeTags);

    const filteredCards = cards.filter((card) => {
      const cardTitle = card.dataset.title || "";
      const matchesTitle = !postQuery || cardTitle.includes(postQuery);

      const matchesType =
        activeType === "all" ||
        (activeType === "project" && card.dataset.hasProject === "true") ||
        (activeType === "tournament" && card.dataset.hasTournament === "true");

      const cardTags = card.dataset.tags ? card.dataset.tags.split(",") : [];
      const matchesTags =
        selectedTagsList.length === 0 ||
        selectedTagsList.every((t) => cardTags.includes(t));

      return matchesTitle && matchesType && matchesTags;
    });

    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * pageSize;
    const visibleSet = new Set(
      filteredCards.slice(startIndex, startIndex + pageSize)
    );

    cards.forEach((card) => {
      const isVisible = visibleSet.has(card);
      card.classList.toggle("flex", isVisible);
      card.classList.toggle("hidden", !isVisible);
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", filteredCards.length > 0);
    }

    if (paginationNav && prevBtn && nextBtn && pageIndicator) {
      const showPagination = filteredCards.length > pageSize;
      paginationNav.classList.toggle("flex", showPagination);
      paginationNav.classList.toggle("hidden", !showPagination);

      const pageTemplate = pageIndicator.dataset.pageTemplate || "Page {current} of {total}";
      pageIndicator.textContent = pageTemplate
        .replace("{current}", String(currentPage))
        .replace("{total}", String(totalPages));
      prevBtn.disabled = currentPage <= 1;
      nextBtn.disabled = currentPage >= totalPages;
    }
  }

  postSearchInput?.addEventListener("input", (e) => {
    postQuery = (e.target as HTMLInputElement).value.trim().toLowerCase();
    currentPage = 1;
    render();
  });

  tagSearchInput?.addEventListener("input", (e) => {
    tagQuery = (e.target as HTMLInputElement).value.trim().toLowerCase().replace(/^#/, "");
    syncTagsVisibility();
  });

  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedType = btn.dataset.filterType as "all" | "project" | "tournament";
      if (!selectedType || selectedType === activeType) return;

      activeType = selectedType;
      currentPage = 1;
      syncFilterButtonsUI();
      render();
    });
  });

  tagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const clickedTag = btn.dataset.filterTag;
      if (!clickedTag) return;

      if (activeTags.has(clickedTag)) {
        activeTags.delete(clickedTag);
      } else {
        activeTags.add(clickedTag);
      }

      currentPage = 1;
      syncFilterButtonsUI();
      render();
    });
  });

  toggleTagsBtn?.addEventListener("click", () => {
    tagsExpanded = !tagsExpanded;
    syncTagsVisibility();
  });

  clearTagsBtn?.addEventListener("click", () => {
    activeTags.clear();
    if (tagSearchInput) {
      tagSearchInput.value = "";
      tagQuery = "";
    }
    currentPage = 1;
    syncFilterButtonsUI();
    render();
  });

  prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      render();
      listContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  nextBtn?.addEventListener("click", () => {
    currentPage++;
    render();
    listContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  syncFilterButtonsUI();
  render();
}

document.addEventListener("astro:page-load", initBlogFilter);