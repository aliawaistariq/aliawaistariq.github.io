# aliawaistariq.github.io

This repository is a static GitHub Pages portfolio with no framework and no build process.

## Where Portfolio Content Lives

All editable portfolio content lives in `content/portfolio.json`.

Update this file to change:
- profile details
- skills
- services
- experience
- contact information
- social links
- projects

## Project Schema

Each project in `content/portfolio.json` supports:

```json
{
  "id": "project-id",
  "title": "Project title",
  "category": "web-development",
  "shortDescription": "Short summary",
  "description": "Longer description",
  "role": "Your role or Needs confirmation",
  "technologies": ["Verified technology"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/example/repo",
  "image": "assets/images/projects/example.jpg",
  "featured": true,
  "displayOrder": 1,
  "caseStudy": "Verified case study notes",
  "status": "Live",
  "webDevelopment": {
    "websitePurpose": "What the website is for",
    "pagesFeatures": ["Homepage", "Contact form"]
  },
  "seo": {
    "websiteBusiness": "",
    "objective": "",
    "servicesWorkPerformed": "",
    "targetMarketLocation": "",
    "verifiedResults": ""
  },
  "aiAutomation": {
    "businessProblem": "",
    "automationWorkflow": "",
    "aiFunctionality": "",
    "integrations": [],
    "demoUrl": ""
  }
}
```

`githubUrl` is optional. Leave it as an empty string when no public repository exists.

Supported project categories:
- `web-development`
- `seo`
- `ai-automation`

Only fill the optional category-specific object that applies to the project. Leave unrelated optional fields empty.

## How To Add A Project

1. Open `content/portfolio.json`.
2. Add a new object to the `projects` array.
3. Set a unique `id`.
4. Set `category` to `web-development`, `seo`, or `ai-automation`.
5. Set `displayOrder` to control where it appears.
6. Add `liveUrl` and leave `githubUrl` empty if no repository is public.

## How To Mark A Project As Featured

Set:

```json
"featured": true
```

Projects marked `featured: true` appear automatically in the Featured Projects section.

## Project Filters

The Projects section automatically creates these filters from the shared project collection:
- `All`
- `Web Development`
- `SEO`
- `AI Automation`

No project HTML needs to be edited manually. Update only `content/portfolio.json`.

## How To Add Project Images

1. Put image files in `assets/images/projects/`.
2. Reference the path in the project's `image` field.

Example:

```json
"image": "assets/images/projects/project-one.jpg"
```

## How To Update Social And Contact Information

Update these sections in `content/portfolio.json`:
- `contact`
- `social`

For additional social links, add items to:

```json
"otherLinks": [
  {
    "label": "X",
    "url": "https://example.com"
  }
]
```

## GitHub Pages Deployment

Deployment is unchanged:
- Repository: `aliawaistariq/aliawaistariq.github.io`
- Branch: `main`
- Source: root
- No build step

GitHub Pages serves the static files in this repository directly. Any valid changes to `index.html`, `assets/`, or `content/portfolio.json` remain compatible with deployment.
