# Bhebhz & Pookiemon

Open the folder in VS Code, install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.
(Double-clicking index.html also works, but Live Server is the most reliable for sound, video and full screen.)

## Files
- `index.html` - page structure (gate screen, intro, folder cards, video player, slideshow, "Invalid" message)
- `style.css` - all the looks: split black/white background, cards, intro timings
- `script.js` - sounds (made in code), intro, video, slideshow, locked dates. Photo list and captions are at the top.
- `assets/photos` - slideshow photos (rename/remove files, then edit the list in script.js)
- `assets/images` - folder card covers
- `assets/video/episode1.mp4` - your video

## Quick edits
- Change a caption: edit the list `SL` at the top of `script.js`.
- Remove a photo: delete its line from `SL`.
- Intro length: the `.go ...` lines in `style.css` (seconds) and the `setTimeout` list in `intro()` in `script.js`.
- Rename Date 2 / Date 3: in `index.html`, the two `card lock` cards.

## Newer features
- **Intro** moves to the chapters page by itself (about 14 seconds); the faded photos appear with the title.
- **Search** on the chapters page: each chapter's keywords are in `data-keys` in `index.html`.
- **Slideshow frame:** every photo sits in a 3:4 frame; photos that aren't 3:4 get a matching blurred fill.
- **Film looks** (off by default now): add `?look=tv`, `?look=view`, `?look=strip` or `?look=mix` to the link to force one while testing.
- **Light / dark theme** button in the top bar (the film parts stay dark).
- Photo lists: `SECTIONS` (the Park slideshow) and `CHAPTERS` (Flowers and Dates, kept for when you unlock them) at the top of `script.js`; the wall photos are in `WALL_ALL` and `WALL_SOFT`.
- **Slideshow order:** part 1 ("Up close") shows the photos that can fill the screen, part 2 ("The bigger picture") shows the rest in a 3:4 frame over the same faded photo wall as the chapters page. Which photos fill the screen depends on the device (an upright phone vs a laptop). Inside each part the light -> dark order of `SECTIONS` is kept. Rename the two parts in `GROUPS` in `script.js`.
- **Memories** (bottom of the chapters page): plain photos, no slideshow. Tap one to open it, swipe or use the arrows to browse, ✕ or the phone's Back button to close. The list is `MEM` in `script.js`.
- **Walls:** the intro is plain black (no photos). The chapters wall (`WALL_ALL`) uses every photo sent, each once before any repeats, in small ~80px tiles (22 across on a desktop) that are dark and fade to black at the edges. The wall covers the whole chapters page and scrolls with it; the page ends with the footer and a Back to top button. How far the page runs past the content is `--scroll-extra` in `style.css` (`buildChaptersWall` in `script.js` builds the wall). The email screenshot is left out because it shows someone else's details.
- **Chapters page layout** (matched to the reference screenshot): the first screen is a centred block, with "Our chapters" at the left (the search sits at the top right under the title), the three cards as a row in the middle, and "Pick your mood" at the left. It's the `.stage` block in `index.html`; Memories, the footer and Back to top scroll below it.
- **Chapters page text sizes** are the original ones (18px title and headings, 12px chips, 11px top buttons, 15px card labels); they scale down on phones. Keep new styling out of those rules so the page keeps looking like the previous version.
- **Chapters page scaling (desktop):** on windows 1000px wide and up, the chapters page sizes (title, headings, cards, chips, top buttons, search) are set in `vw` units at the bottom of `style.css`, taken from the reference screenshot, so the page keeps the same proportions at any window size, zoom or display scale. Phones and tablets use the original fixed sizes.
- **Slideshow look:** every photo now uses the same framed 3:4 look over the faded photo wall. Full-screen mode is off (one line in `script.js`, search for `var full = false`).
- **Where photos live:** Park slideshow = `SECTIONS`, Dates = `CHAPTERS.dates`, Flowers = `CHAPTERS.flowers` (no photo is in two chapters). Dates and Flowers stay locked, so their photos aren't shown yet. Memories = `MEM_GROUPS` (Us, Her, Him), each photo once; a photo can be in Memories and in a chapter at the same time.
- **Locked cards (Dates, Flowers)** are dimmed, as in the reference screenshot; they must not be made bright.
