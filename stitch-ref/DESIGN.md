# Design System Document: The Neo-Geocities Editorial

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Time Capsule"
This design system rejects the sterile, homogenized "Modern Web" in favor of a maximalist, high-end interpretation of 2003-era personal web design. We are not just mimicking a "retro" look; we are elevating the "hand-coded" aesthetic into a professional, signature visual identity. 

The system breaks the "template" look through **intentional friction**: using overlapping windows, high-contrast neon collisions, and a hierarchy that prioritizes personality over traditional whitespace. We leverage "The Glitch" as a feature—utilizing marquee animations and blinking text not as clutter, but as intentional focal points that guide the eye to primary calls-to-action.

---

## 2. Colors

The palette is a high-octane collision of electric neons against a neutral, high-end "monitor grey" background.

### The Palette
- **Primary (`#106b00` / `#32ff00`):** Electric Lime. Used for high-energy interaction and success states.
- **Secondary (`#a400a4` / `#ffbdf3`):** Hot Pink. Used for expressive accents and brand personality.
- **Tertiary (`#080cff` / `#a4aaff`):** Electric Blue. Used for links and deep-space interactive elements.

### The "No-Line" Rule
While the original 2003 aesthetic used table borders, this professional interpretation prohibits standard 1px solid grey borders for layout. Instead, boundaries are defined by **background color shifts**. Use `surface-container-low` for large sectioning and `surface-container-highest` for internal modules. 

### Signature Textures
To move beyond flat hex codes, incorporate **Tiled Backgrounds**. Use a 32x32px repeating "star" or "flame" GIF/PNG pattern on the `background` layer. Main CTAs should utilize a linear gradient from `primary` to `primary_container` to create a "pulsing" liquid-crystal effect.

---

## 3. Typography

The type system is a dual-narrative between the "Aggressive Headline" and the "Personal Monologue."

- **Display & Headlines (Impact / Epilogue):** Use `display-lg` and `headline-lg` for Impact-style headers. These should be set in all-caps with `-2%` letter spacing to mimic the "boldly unoptimized" look of early 2000s banners.
- **Body & Titles (Comic Sans / BeVietnamPro):** For a signature "hand-coded" feel, `body-lg` uses a high-end sans-serif that echoes the curves of Comic Sans. It communicates approachability and a "personal blog" intimacy.
- **Labels (Plus Jakarta Sans):** Small-scale utility text should remain highly legible to balance the chaotic energy of the display faces.

---

## 4. Elevation & Depth

We move away from Material-style soft shadows, opting for **Tactile Brutalism**.

- **The Layering Principle:** Stack `surface-container-lowest` cards on `surface-container-low` sections. This creates a "windowed" effect, reminiscent of stacked OS windows.
- **Hard-Drop Shadows:** When a floating effect is required, do not use soft blurs. Use a hard-edge shadow (Opacity 100%, Blur 0px, Offset 4px) using the `on_surface` color. This mimics the "MSN Messenger" window depth.
- **The "Ghost Border" Fallback:** If a container needs definition, use the `outline_variant` at 20% opacity. For the "Hand-Coded" look, use a **3px thick border** on buttons and active windows to create a chunky, toy-like feel.
- **Glassmorphism:** Use `backdrop-filter: blur(10px)` on chat windows (`surface_variant` at 80% opacity) to allow the tiled star backgrounds to bleed through, softening the interface.

---

## 5. Components

### Buttons
- **Primary:** Chunky `1rem` (default) or `1.5rem` (md) roundedness. 3px solid `on_primary_fixed` border. Background uses a `primary` to `primary_container` gradient.
- **Interaction:** On hover, the button should shift its hard-drop shadow from 4px to 1px, creating a "pressed" physical sensation.

### Chat Windows (MSN/AIM Style)
- **Structure:** Use `surface_container_highest` for the title bar and `surface_container_lowest` for the message area.
- **Header:** Title bars should be `tertiary` (Electric Blue) with white text. Include "Minimize/Maximize/Close" icons as pixel-art primitives.

### Blinking & Marquee (The "Pulse")
- **Blinking Text:** Reserved for "Critical" or "Live" states. Use `error` color with a 1-second step-animation.
- **Marquee:** Use for secondary news feeds or "current status" updates at the top of the `surface` layer.

### Input Fields
- **Styling:** Thick 2px inset borders (using `outline`) to mimic classic HTML form fields.
- **Focus State:** When active, the border should switch to `secondary` (Hot Pink) with a glowing `secondary_container` outer shadow.

### Divider Bars
- **Pixel Dividers:** Forbid standard `<hr>` lines. Use a repeating 2px-high "Pixel Bar" graphic using alternating `primary` and `secondary` color blocks.

---

## 6. Do's and Don'ts

### Do:
- **Overlap Elements:** Let a chat window slightly hang over a section divider. It breaks the grid and feels "custom-coded."
- **Use High Contrast:** Place `primary` (Lime) text directly on `inverse_surface` (Dark Grey) for that "terminal" aesthetic.
- **Animate Transitions:** Use "slide-in" animations for windows to mimic old-school window opening speeds.

### Don't:
- **Don't use 1px Borders:** It makes the system look like a generic bootstrap theme. Stick to 0px or 3px+.
- **Don't Over-Saturate the Body:** Keep long-form text on `surface_container_lowest` (white/off-white) for readability. Only use the "Neon" colors for headers and UI chrome.
- **Don't Align Everything:** Use slight asymmetries in your column widths (e.g., a 45/55 split instead of 50/50) to enhance the "hand-built" personality.

---

## 7. Editorial Component: The "Profile Card"
A custom component for this system is the **Legacy Profile Card**. It features a low-res (pixelated filter) avatar, a "Current Mood" emoji, and a marquee scrolling "Currently Listening To..." status. This acts as the primary "User Identity" module across the application.