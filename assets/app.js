(function () {
  var CONTENT_PATH = "content/portfolio.json";
  var PROJECT_FILTERS = [
    { key: "all", label: "All" },
    { key: "web-development", label: "Web Development" },
    { key: "seo", label: "SEO" },
    { key: "ai-automation", label: "AI Automation" }
  ];
  var activeProjectFilter = "all";
  var projectCache = [];

  function text(value, fallback) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return fallback;
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
    node.innerHTML = "";
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
    setText("brand-name", profile.name, "Name placeholder");
    setText("hero-eyebrow", profile.heroEyebrow || profile.headline, "Headline placeholder");
    setText("hero-headline", profile.heroTitle || profile.headline, "Headline placeholder");
    setText("hero-about", profile.about, "About placeholder. Add your professional summary in content/portfolio.json.");
    setText("about-copy", profile.about, "About placeholder. Add your professional summary in content/portfolio.json.");
    setText("availability-value", profile.availability, "Needs update");
    setText("location-value", profile.location, "Needs update");
    setText("footer-copy", "© 2026 " + text(profile.name, "Portfolio"), "© 2026 Portfolio");

    var profileMeta = document.getElementById("profile-meta");
    profileMeta.innerHTML = "";
    [profile.location, profile.availability].forEach(function (item) {
      if (text(item, "")) {
        profileMeta.appendChild(create("span", "meta-chip", item));
      }
    });

    var heroCta = document.getElementById("hero-cta");
    heroCta.innerHTML = "";
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
    highlights.innerHTML = "";
    array(profile.highlights).forEach(function (item) {
      var card = create("div", "mini-card");
      card.appendChild(create("strong", "", text(item.title, "Highlight")));
      card.appendChild(create("span", "", text(item.description, "Needs update")));
      highlights.appendChild(card);
    });
    if (!highlights.children.length) {
      var placeholder = create("div", "mini-card");
      placeholder.appendChild(create("strong", "", "Highlights"));
      placeholder.appendChild(create("span", "", "Add summary highlights in content/portfolio.json."));
      highlights.appendChild(placeholder);
    }
  }

  function renderSkills(data) {
    var grid = document.getElementById("skills-grid");
    grid.innerHTML = "";
    array(data.skills).forEach(function (group) {
      var card = create("article", "skill");
      card.appendChild(create("h3", "", text(group.category, "Skill category")));
      card.appendChild(create("p", "", array(group.items).join(", ") || "Add skill items in content/portfolio.json."));
      grid.appendChild(card);
    });
  }

  function renderServices(data) {
    var grid = document.getElementById("services-grid");
    grid.innerHTML = "";
    array(data.services).forEach(function (service) {
      var card = create("article", "service-card");
      card.appendChild(create("h3", "", text(service.title, "Service title")));
      card.appendChild(create("p", "", text(service.description, "Service description placeholder.")));
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
    list.innerHTML = "";
    array(data.experience).forEach(function (entry) {
      var card = create("article", "experience-card");
      card.appendChild(create("h3", "", text(entry.title, "Experience title")));
      card.appendChild(create("div", "experience-meta", [text(entry.company, "Needs update"), text(entry.period, "Needs update")].filter(Boolean).join(" • ")));
      card.appendChild(create("p", "", text(entry.description, "Experience description placeholder.")));
      list.appendChild(card);
    });
    if (!list.children.length) {
      var empty = create("div", "empty-state");
      empty.appendChild(create("p", "", "No experience entries added yet."));
      list.appendChild(empty);
    }
  }

  function buildProjectCard(project) {
    var card = create("article", "project");
    var top = create("div", "project-top");
    top.appendChild(create("h3", "", text(project.title, "Untitled project")));
    if (text(project.status, "")) {
      top.appendChild(create("span", "project-status", project.status));
    }
    card.appendChild(top);

    if (text(project.category, "")) {
      card.appendChild(create("span", "project-category", project.category));
    }

    card.appendChild(create("p", "", text(project.shortDescription, "Project summary placeholder.")));

    var details = create("div", "project-details");
    if (text(project.description, "")) {
      details.appendChild(create("p", "", project.description));
    }
    if (text(project.role, "")) {
      details.appendChild(create("p", "", "Role: " + project.role));
    }
    if (text(project.caseStudy, "")) {
      details.appendChild(create("p", "", "Case study notes: " + project.caseStudy));
    }
    if (details.children.length) {
      card.appendChild(details);
    }

    var projectMeta = create("div", "project-meta-list");
    if (project.category === "web-development" && project.webDevelopment) {
      if (text(project.webDevelopment.websitePurpose, "")) {
        var purpose = create("p", "project-meta-item");
        purpose.innerHTML = "<strong>Website purpose:</strong> " + project.webDevelopment.websitePurpose;
        projectMeta.appendChild(purpose);
      }
      if (array(project.webDevelopment.pagesFeatures).length) {
        var pages = create("p", "project-meta-item");
        pages.innerHTML = "<strong>Pages/features:</strong> " + array(project.webDevelopment.pagesFeatures).join(", ");
        projectMeta.appendChild(pages);
      }
    }
    if (project.category === "seo" && project.seo) {
      if (text(project.seo.websiteBusiness, "")) {
        var business = create("p", "project-meta-item");
        business.innerHTML = "<strong>Website/business:</strong> " + project.seo.websiteBusiness;
        projectMeta.appendChild(business);
      }
      if (text(project.seo.objective, "")) {
        var objective = create("p", "project-meta-item");
        objective.innerHTML = "<strong>SEO objective:</strong> " + project.seo.objective;
        projectMeta.appendChild(objective);
      }
      if (text(project.seo.servicesWorkPerformed, "")) {
        var services = create("p", "project-meta-item");
        services.innerHTML = "<strong>SEO work:</strong> " + project.seo.servicesWorkPerformed;
        projectMeta.appendChild(services);
      }
      if (text(project.seo.targetMarketLocation, "")) {
        var market = create("p", "project-meta-item");
        market.innerHTML = "<strong>Target market/location:</strong> " + project.seo.targetMarketLocation;
        projectMeta.appendChild(market);
      }
      if (text(project.seo.verifiedResults, "")) {
        var results = create("p", "project-meta-item");
        results.innerHTML = "<strong>Verified results:</strong> " + project.seo.verifiedResults;
        projectMeta.appendChild(results);
      }
    }
    if (project.category === "ai-automation" && project.aiAutomation) {
      if (text(project.aiAutomation.businessProblem, "")) {
        var problem = create("p", "project-meta-item");
        problem.innerHTML = "<strong>Business problem:</strong> " + project.aiAutomation.businessProblem;
        projectMeta.appendChild(problem);
      }
      if (text(project.aiAutomation.automationWorkflow, "")) {
        var workflow = create("p", "project-meta-item");
        workflow.innerHTML = "<strong>Automation workflow:</strong> " + project.aiAutomation.automationWorkflow;
        projectMeta.appendChild(workflow);
      }
      if (text(project.aiAutomation.aiFunctionality, "")) {
        var aiFunctionality = create("p", "project-meta-item");
        aiFunctionality.innerHTML = "<strong>AI functionality:</strong> " + project.aiAutomation.aiFunctionality;
        projectMeta.appendChild(aiFunctionality);
      }
      if (array(project.aiAutomation.integrations).length) {
        var integrations = create("p", "project-meta-item");
        integrations.innerHTML = "<strong>Integrations:</strong> " + array(project.aiAutomation.integrations).join(", ");
        projectMeta.appendChild(integrations);
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
    grid.innerHTML = "";
    [
      { title: "Email", value: (data.contact || {}).email || "" },
      { title: "Phone", value: (data.contact || {}).phone || "" },
      { title: "WhatsApp", value: (data.contact || {}).whatsapp || "" },
      { title: "Location", value: (data.contact || {}).location || (data.profile || {}).location || "" }
    ].forEach(function (item) {
      var card = create("article", "contact");
      card.appendChild(create("h3", "", item.title));
      card.appendChild(create("p", "", text(item.value, "Needs update")));
      grid.appendChild(card);
    });

    var socials = document.getElementById("social-links");
    socials.innerHTML = "";
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
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div class="wrap"><div class="panel section"><h2 class="section-title">Content Load Error</h2><p class="section-copy">Portfolio content could not be loaded. Check <code>content/portfolio.json</code>.</p></div></div>'
      );
    });
})();
