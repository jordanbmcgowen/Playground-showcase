# Claude Task: Add a New Site to the Showcase

Use this task whenever you need to add a new website to the Playground Showcase.

---

## Inputs Required

Before starting, collect the following from the user (or accept them inline):

| Field | Example |
|---|---|
| Site URL | `https://mysite.com` |
| Display name | `MySite` |
| One-sentence description | `A tool that does X.` |
| Device type | `phone`, `laptop`, or `tablet` |

If the user doesn't specify a device type, choose based on the site:
- **phone** — mobile-first apps, simple tools, single-page experiences
- **laptop** — dashboards, data-heavy sites, marketing pages
- **tablet** — content-rich apps, editorial layouts, portfolio pieces

---

## Step 1 — Capture a Screenshot

Use your browser functionality to navigate to the site URL and take a full-page screenshot.

- Save it to `./assets/screen-<slug>.jpg`
  - `<slug>` = lowercase site name, no spaces or special characters (e.g. `mysite`, `tight-lines`)
- The image should capture the full page height (not just the viewport) so the scroll animation has content to travel through
- If the site is password-protected or unavailable, ask the user to provide a screenshot file

---

## Step 2 — Read the Current Layout

Read `index.html` to:
1. Count the existing devices (numbered comments `<!-- Device N: ... -->`)
2. Note the `--x`, `--y`, and `--rot` values already in use

**Existing device positions (for reference):**
- Row 1 (`--y: ~2–8%`): x=3%, x=15%, x=43%
- Row 2 (`--y: ~50–55%`): x=8%, x=20%, x=47%

Pick a position that fills a visible gap, or start a new row at `--y: 100%` if both rows are full. Alternate the rotation sign from neighbouring devices (±2–8deg).

---

## Step 3 — Insert the Device Block

Edit `index.html` to insert a new device block **before the closing `</div>`** of `<div class="device-floor" id="deviceFloor">`.

Use this template, filling in every `[placeholder]`:

```html
    <!-- Device [N]: [DeviceType] — [Site Name] -->
    <article class="device device--[phone|laptop|tablet]"
       data-scroll-speed="[speed]">
      <a class="device__primary-link" href="[URL]" target="_blank" rel="noopener noreferrer" aria-label="Open [Site Name]">
        <div class="device__screen-clip device__screen-clip--[phone|laptop|tablet]">
          <img class="device__screenshot" src="./assets/screen-[slug].jpg" alt="" draggable="false">
        </div>
        <img class="device__frame" src="./assets/frame-[iphone|macbook|ipad].png" alt="[DeviceType] showing [Site Name]" draggable="false">
      </a>
      <div class="device__label">
        <span class="device__title">[Site Name]</span>
        <span class="device__desc">[One-sentence description.]</span>
        <div class="device__icons">
          <a href="https://github.com/jordanbmcgowen/[repo-slug]" target="_blank" rel="noopener noreferrer"
             class="device__github" aria-label="View on GitHub">
            <svg class="device__github-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <a href="[URL]" target="_blank" rel="noopener noreferrer"
             class="device__link" aria-label="Visit website">
            <svg class="device__link-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M6.5 3.5H3a1 1 0 0 0-1 1V13a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1V9.5"/>
              <path d="M9.5 1.5h5v5"/>
              <path d="M14.5 1.5L7 9"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
```

> **Note on `[repo-slug]`:** Ask the user for the GitHub repository name if not obvious. If unknown, use the site slug as a best guess and note it may need updating.

**Class and asset mapping:**

| Device type | `class` | `frame src` | `screen-clip class` | `data-scroll-speed` |
|---|---|---|---|---|
| phone | `device--phone` | `frame-iphone.png` | `device__screen-clip--phone` | `0.12`–`0.15` |
| laptop | `device--laptop` | `frame-macbook.png` | `device__screen-clip--laptop` | `0.08` |
| tablet | `device--tablet` | `frame-ipad.png` | `device__screen-clip--tablet` | `0.10` |

> **No changes needed** to `style.css` or `app.js` — they automatically pick up any new `.device` element.

---

## Step 4 — Verify

1. Read the modified `index.html` and confirm:
   - The new block is syntactically correct
   - The device number in the comment is sequential
   - The screenshot `src` path matches the saved file name exactly
2. Confirm the screenshot file exists at `./assets/screen-<slug>.jpg`

---

## Step 5 — Commit and Push

Stage and commit with a descriptive message:

```
Add [Site Name] to showcase ([device type] device)
```

Push to the current working branch.

---

## Device Frame Reference

The three device frame PNGs are in `./assets/`:

| File | Dimensions | Screen area (% of frame) |
|---|---|---|
| `frame-iphone.png` | 400 × 788 px | left: 8.50%, top: 4.31%, w: 83%, h: 91.37% |
| `frame-macbook.png` | 800 × 520 px | left: 11.75%, top: 11.73%, w: 76.50%, h: 76.54% |
| `frame-ipad.png` | 500 × 690 px | left: 6%, top: 4.35%, w: 88%, h: 91.30% |

Screenshots are clipped to these areas by CSS — the frame image sits on top with `z-index: 2`, and the screenshot scrolls within the clip container underneath.
