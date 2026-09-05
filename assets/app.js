(function () {
  var CONTENT_PATH = "content/portfolio.json?v=20260905-cleanup";
  var PROJECT_FILTERS = [
    { key: "all", label: "All" },
    { key: "web-development", label: "Web Development" },
    { key: "seo", label: "SEO" },
    { key: "ai-automation", label: "AI Automation" }
  ];
  var activeProjectFilter = "all";
  var projectCache = [];
  var CATEGORY_LABELS = {
    "web-development": "Web Development",
    "seo": "SEO",
    "ai-automation": "AI Automation"
  };

  function text(value, fallback) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return fallback;
  }

  function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function isPlaceholder(value) {
    if (!hasText(value)) {
      return true;
    }
    return /needs update|needs confirmation|placeholder|replace this placeholder/i.test(value);
  }

  function array(value) {
    return Array.isArray(value) ? value : [];
  }

  function byOrder(items) {
    return items.slice().sort(function (a, b) {
      var left = Number.isFinite(a.displayOrder) ? a.displayOrder : Number.MAX_SAFE_INTEGER;
      var right = Number.isFinite(b.displayOrder) ? b.displayOrder : Number.MAX_SAFE_INTEGER;
      return left - right;
    });
  }

  function create(tag, className, textContent) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (typeof textContent === "string") {
      node.textContent = textContent;
    }
    return node;
  }

  function clear(node) {
    if (node) {
      node.replaceChildren();
    }
  }

  function showSection(id, shouldShow) {
    var section = document.getElementById(id);
    if (section) {
      section.classList.toggle("hidden", !shouldShow);
    }
  }

  function categoryLabel(category) {
    return CATEGORY_LABELS[category] || text(category, "Project");
  }

  function createMetaItem(label, value) {
    var item = create("p", "project-meta-item");
    var strong = create("strong", "", label + ": ");
    item.appendChild(strong);
    item.appendChild(document.createTextNode(value));
    return item;
  }

  function setText(id, value, fallback) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = text(value, fallback);
    }
  }

  function setDocumentMeta(profile) {
    var title = text(profile.name, "Portfolio") + " | " + text(profile.headline, "Professional Portfolio");
    document.title = title;
    var descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", text(profile.about, "Portfolio website"));
    }
  }

  function renderProfile(data) {
    var profile = data.profile || {};
    setDocumentMeta(profile);
    setText("brand-name", profile.name, "Portfolio");
    setText("hero-eyebrow", profile.heroEyebrow || profile.headline, "Professional Portfolio");
    setText("hero-headline", profile.heroTitle || profile.headline, "Professional Portfolio");
    setText("hero-about", profile.about, "");
    setText("about-copy", profile.about, "");
    var availabilityCard = document.getElementById("availability-value")?.closest(".mini-card");
    var locationCard = document.getElementById("location-value")?.closest(".mini-card");
    if (availabilityCard) {
      availabilityCard.classList.toggle("hidden", !hasText(profile.availability));
    }
    if (locationCard) {
      locationCard.classList.toggle("hidden", !hasText(profile.location));
    }
    setText("availability-value", profile.availability, "");
    setText("location-value", profile.location, "");
    setText("footer-copy", "© 2026 " + text(profile.name, "Portfolio"), "© 2026 Portfolio");

    var profileMeta = document.getElementById("profile-meta");
    clear(profileMeta);
    [profile.location, profile.availability].forEach(function (item) {
      if (text(item, "")) {
        profileMeta.appendChild(create("span", "meta-chip", item));
      }
    });

    var heroCta = document.getElementById("hero-cta");
    clear(heroCta);
    var primaryLink = (data.social || {}).github || "";
    var primary = create("a", "btn btn-primary", primaryLink ? "View GitHub" : "Update Social Links");
    primary.href = primaryLink || "#contact";
    if (primaryLink) {
      primary.target = "_blank";
      primary.rel = "noreferrer";
    }
    heroCta.appendChild(primary);
    var secondary = create("a", "btn btn-secondary", "Work With Me");
    secondary.href = "#contact";
    heroCta.appendChild(secondary);

    var highlights = document.getElementById("hero-highlights");
    clear(highlights);
    array(profile.highlights).forEach(function (item) {
      if (!hasText(item.title) && !hasText(item.description)) {
        return;
      }
      var card = create("div", "mini-card");
      card.appendChild(create("strong", "", text(item.title, "Highlight")));
      card.appendChild(create("span", "", text(item.description, "")));
      highlights.appendChild(card);
    });
  }

  function renderSkills(data) {
    var grid = document.getElementById("skills-grid");
    clear(grid);
    array(data.skills).forEach(function (group) {
      var card = create("article", "skill");
      card.appendChild(create("h3", "", text(group.category, "Skill category")));
      card.appendChild(create("p", "", array(group.items).join(", ") || "Add skill items in content/portfolio.json."));
      grid.appendChild(card);
    });
  }

  function renderServices(data) {
    var grid = document.getElementById("services-grid");
    clear(grid);
    array(data.services).forEach(function (service) {
      var card = create("article", "service-card");
      card.appendChild(create("h3", "", text(service.title, "Service title")));
      card.appendChild(create("p", "", text(service.description, "Service details coming soon.")));
      var features = array(service.features);
      if (features.length) {
        var list = create("div", "service-features");
        features.forEach(function (feature) {
          list.appendChild(create("span", "service-feature", feature));
        });
        card.appendChild(list);
      }
      grid.appendChild(card);
    });
  }

  function renderExperience(data) {
    var list = document.getElementById("experience-list");
    clear(list);
    var entries = array(data.experience).filter(function (entry) {
      return !isPlaceholder(entry.title) || !isPlaceholder(entry.company) || !isPlaceholder(entry.period) || !isPlaceholder(entry.description);
    });
    showSection("experience", entries.length > 0);
    entries.forEach(function (entry) {
      var card = create("article", "experience-card");
      if (hasText(entry.title)) {
        card.appendChild(create("h3", "", entry.title));
      }
      var meta = [entry.company, entry.period].filter(hasText).join(" • ");
      if (meta) {
        card.appendChild(create("div", "experience-meta", meta));
      }
      if (hasText(entry.description)) {
        card.appendChild(create("p", "", entry.description));
      }
      list.appendChild(card);
    });
  }

  function buildProjectCard(project) {
    var card = create("article", "project");
    var top = create("div", "project-top");
    top.appendChild(create("h3", "", text(project.title, "Untitled project")));
    if (text(project.status, "")) {
      top.appendChild(create("span", "project-status", project.status));
    }
    card.appendChild(top);

    if (hasText(project.category)) {
      card.appendChild(create("span", "project-category", categoryLabel(project.category)));
    }

    card.appendChild(create("p", "", text(project.shortDescription, "Project details coming soon.")));

    var details = create("div", "project-details");
    if (text(project.description, "")) {
      details.appendChild(create("p", "", project.description));
    }
    if (!isPlaceholder(project.role)) {
      details.appendChild(create("p", "", "Role: " + project.role));
    }
    if (!isPlaceholder(project.caseStudy)) {
      details.appendChild(create("p", "", "Case study notes: " + project.caseStudy));
    }
    if (details.children.length) {
      card.appendChild(details);
    }

    var projectMeta = create("div", "project-meta-list");
    if (project.category === "web-development" && project.webDevelopment) {
      if (text(project.webDevelopment.websitePurpose, "")) {
        projectMeta.appendChild(createMetaItem("Website purpose", project.webDevelopment.websitePurpose));
      }
      if (array(project.webDevelopment.pagesFeatures).length) {
        projectMeta.appendChild(createMetaItem("Pages/features", array(project.webDevelopment.pagesFeatures).join(", ")));
      }
    }
    if (project.category === "seo" && project.seo) {
      if (text(project.seo.websiteBusiness, "")) {
        projectMeta.appendChild(createMetaItem("Website/business", project.seo.websiteBusiness));
      }
      if (text(project.seo.objective, "")) {
        projectMeta.appendChild(createMetaItem("SEO objective", project.seo.objective));
      }
      if (text(project.seo.servicesWorkPerformed, "")) {
        projectMeta.appendChild(createMetaItem("SEO work", project.seo.servicesWorkPerformed));
      }
      if (text(project.seo.targetMarketLocation, "")) {
        projectMeta.appendChild(createMetaItem("Target market/location", project.seo.targetMarketLocation));
      }
      if (text(project.seo.verifiedResults, "")) {
        projectMeta.appendChild(createMetaItem("Verified results", project.seo.verifiedResults));
      }
    }
    if (project.category === "ai-automation" && project.aiAutomation) {
      if (text(project.aiAutomation.businessProblem, "")) {
        projectMeta.appendChild(createMetaItem("Business problem", project.aiAutomation.businessProblem));
      }
      if (text(project.aiAutomation.automationWorkflow, "")) {
        projectMeta.appendChild(createMetaItem("Automation workflow", project.aiAutomation.automationWorkflow));
      }
      if (text(project.aiAutomation.aiFunctionality, "")) {
        projectMeta.appendChild(createMetaItem("AI functionality", project.aiAutomation.aiFunctionality));
      }
      if (array(project.aiAutomation.integrations).length) {
        projectMeta.appendChild(createMetaItem("Integrations", array(project.aiAutomation.integrations).join(", ")));
      }
    }
    if (projectMeta.children.length) {
      card.appendChild(projectMeta);
    }

    var tech = array(project.technologies).filter(Boolean);
    if (tech.length) {
      var techList = create("div", "tech-list");
      tech.forEach(function (item) {
        techList.appendChild(create("span", "tech-pill", item));
      });
      card.appendChild(techList);
    }

    var links = create("div", "project-links");
    if (text(project.liveUrl, "")) {
      var live = create("a", "project-link", "Live site");
      live.href = project.liveUrl;
      live.target = "_blank";
      live.rel = "noreferrer";
      links.appendChild(live);
    }
    if (text(project.githubUrl, "")) {
      var repo = create("a", "project-link", "GitHub");
      repo.href = project.githubUrl;
      repo.target = "_blank";
      repo.rel = "noreferrer";
      links.appendChild(repo);
    }
    if (project.category === "ai-automation" && project.aiAutomation && text(project.aiAutomation.demoUrl, "")) {
      var demo = create("a", "project-link", "Demo");
      demo.href = project.aiAutomation.demoUrl;
      demo.target = "_blank";
      demo.rel = "noreferrer";
      links.appendChild(demo);
    }
    if (links.children.length) {
      card.appendChild(links);
    }

    if (text(project.image, "")) {
      card.appendChild(create("span", "project-tag", "Image: " + project.image));
    }

    return card;
  }

  function filterProjects(projects) {
    if (activeProjectFilter === "all") {
      return projects;
    }
    return projects.filter(function (project) {
      return project.category === activeProjectFilter;
    });
  }

  function renderProjectFilters() {
    var filters = document.getElementById("project-filters");
    clear(filters);
    PROJECT_FILTERS.forEach(function (filter) {
      var button = create("button", "filter-button" + (filter.key === activeProjectFilter ? " is-active" : ""), filter.label);
      button.type = "button";
      button.setAttribute("data-filter", filter.key);
      button.addEventListener("click", function () {
        activeProjectFilter = filter.key;
        renderProjectFilters();
        renderProjectList();
      });
      filters.appendChild(button);
    });
  }

  function renderProjectList() {
    var allGrid = document.getElementById("projects-grid");
    clear(allGrid);
    var filtered = filterProjects(projectCache);
    if (filtered.length) {
      filtered.forEach(function (project) {
        allGrid.appendChild(buildProjectCard(project));
      });
    } else {
      var emptyAll = create("div", "empty-state");
      emptyAll.appendChild(create("p", "", "No projects found for this category yet."));
      allGrid.appendChild(emptyAll);
    }
  }

  function renderProjects(data) {
    var projects = byOrder(array(data.projects));
    projectCache = projects;
    var featured = projects.filter(function (project) {
      return project.featured === true;
    });

    var featuredGrid = document.getElementById("featured-projects-grid");
    clear(featuredGrid);
    if (featured.length) {
      featured.forEach(function (project) {
        featuredGrid.appendChild(buildProjectCard(project));
      });
    } else {
      var emptyFeatured = create("div", "empty-state");
      emptyFeatured.appendChild(create("p", "", "No featured projects yet. Mark a project with \"featured\": true in content/portfolio.json."));
      featuredGrid.appendChild(emptyFeatured);
    }
    renderProjectFilters();
    renderProjectList();
  }

  function renderContact(data) {
    var grid = document.getElementById("contact-grid");
    clear(grid);
    [
      { title: "Email", value: (data.contact || {}).email || "" },
      { title: "Phone", value: (data.contact || {}).phone || "" },
      { title: "WhatsApp", value: (data.contact || {}).whatsapp || "" },
      { title: "Location", value: (data.contact || {}).location || (data.profile || {}).location || "" }
    ].forEach(function (item) {
      if (!hasText(item.value)) {
        return;
      }
      var card = create("article", "contact");
      card.appendChild(create("h3", "", item.title));
      card.appendChild(create("p", "", item.value));
      grid.appendChild(card);
    });

    var socials = document.getElementById("social-links");
    clear(socials);
    var socialEntries = [];
    var social = data.social || {};
    if (text(social.github, "")) {
      socialEntries.push({ label: "GitHub", href: social.github });
    }
    if (text(social.linkedin, "")) {
      socialEntries.push({ label: "LinkedIn", href: social.linkedin });
    }
    if (text(social.website, "")) {
      socialEntries.push({ label: "Website", href: social.website });
    }
    array(social.otherLinks).forEach(function (item) {
      if (item && text(item.label, "") && text(item.url, "")) {
        socialEntries.push({ label: item.label, href: item.url });
      }
    });

    socialEntries.forEach(function (item) {
      var link = create("a", "social-link", item.label);
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noreferrer";
      socials.appendChild(link);
    });
    showSection("contact", grid.children.length > 0 || socials.children.length > 0);
  }

  function render(data) {
    renderProfile(data);
    renderSkills(data);
    renderServices(data);
    renderExperience(data);
    renderProjects(data);
    renderContact(data);
  }

  fetch(CONTENT_PATH)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load portfolio content.");
      }
      return response.json();
    })
    .then(function (data) {
      render(data);
    })
    .catch(function (error) {
      console.error(error);
      var wrap = create("div", "wrap");
      var panel = create("div", "panel section");
      panel.appendChild(create("h2", "section-title", "Content Load Error"));
      panel.appendChild(create("p", "section-copy", "Portfolio content could not be loaded. Check content/portfolio.json."));
      wrap.appendChild(panel);
      document.body.appendChild(wrap);
    });
})();
