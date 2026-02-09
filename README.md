# Valentine's Day Website

A playful Valentine's Day page that asks "Will you be my Valentine?" with **Yes** and **No** buttons. The **No** button moves away when you try to click or hover over it.

## How to run

**Use a local server so images from the `Photos/` folder load when you click to open them.**

- **Node:** `npx serve .` then open the URL shown (e.g. http://localhost:3000)
- **Python 3:** `python -m http.server 8000` then visit http://localhost:8000

Opening `index.html` directly (file://) can prevent the Photos images from loading in some browsers.

## Features

- **Yes** – Clicking "Yes" shows a success message.
- **No** – The "No" button jumps to a new position when you hover over it or focus it, so it’s hard to click (all in good fun).
- Works on desktop (mouse) and touch devices.
- Responsive layout and simple, romantic styling.

## Files

- `index.html` – Main page and structure
- `styles.css` – Layout and styling
- `script.js` – Logic for the moving "No" button and "Yes" success state
