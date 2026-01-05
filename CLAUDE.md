# CLAUDE.md - AI Assistant Guide for Najdismazu

## Project Overview

**Najdi smažák** (Find the Junkie) is a satirical, cyberpunk-themed Progressive Web App (PWA) that simulates a "drug user radar" with dark humor. The application features a futuristic scanner interface with animated threat levels, biometric readings, and AI-generated humorous content.

**Primary Language:** Czech
**Type:** Single-page web application (SPA)
**Theme:** Cyberpunk/Dark Humor/Satire
**Target Platform:** Web (mobile-first, PWA-enabled)

---

## Repository Structure

```
Najdismazu/
├── .git/                 # Git repository metadata
└── index.html           # Main application file (all-in-one)
```

### Single-File Architecture

This project uses a **monolithic single-file architecture** where all HTML, CSS, and JavaScript code resides in `index.html`. This approach:

- Simplifies deployment (single file to host)
- Eliminates build steps
- Makes the app instantly runnable
- Ideal for static hosting (GitHub Pages, Netlify, etc.)

---

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup, canvas API for icon generation
- **CSS3** - Custom properties (CSS variables), animations, glassmorphism effects
- **Vanilla JavaScript** - ES6+ features, async/await, DOM manipulation

### External Dependencies (CDN-loaded)
1. **TailwindCSS** (`https://cdn.tailwindcss.com`)
   - Utility-first CSS framework
   - Used for rapid styling without custom CSS files

2. **Google Fonts**
   - `Orbitron` - Futuristic headings and buttons
   - `Share Tech Mono` - Monospace body text for tech aesthetic

3. **Gemini AI API** (Google Generative Language)
   - Model: `gemini-2.5-flash-preview-05-20`
   - Used for generating humorous "dealer advice" and character profiles
   - API key required (currently empty in code)

### Browser APIs Used
- **Canvas API** - Dynamic icon generation for PWA
- **Service Worker** (manifest generation) - PWA functionality
- **Geolocation API** - Not currently used but could be added
- **Vibration API** - Haptic feedback on critical threat levels
- **Intersection Observer** - Not currently used
- **matchMedia** - Prefers-reduced-motion accessibility

---

## Key Features & Functionality

### 1. PWA Icon Generation (Lines 9-125)
- **Dynamic canvas-based icon drawing**
- Generates syringe icon at multiple sizes (32px, 192px, 512px)
- Creates manifest.json via blob URL
- Automatic favicon and Apple touch icon injection

**Key Function:** `drawIcon(size)` - Renders a rotated syringe with liquid gradient

### 2. Visual Scanner Interface (Lines 212-224)
- Animated pulse rings simulating radar scanning
- Dynamic status text with cyberpunk terminology
- Blip generation for visual interest
- State-based color changes

**Animation System:**
- `.scanner-pulse` - Concentric expanding rings with delays
- `.blip` - Randomly positioned animated dots
- `.flash-red` - Critical state visual feedback

### 3. Threat Level System (Lines 311-316)
Four escalating threat levels:
```javascript
[
  { name: 'Na pohodu, jen trošku sjetý', class: 'threat-low', level: 0 },      // Green
  { name: 'Půl dávky v žíle', class: 'threat-medium', level: 1 },              // Yellow
  { name: 'Na šrot', class: 'threat-high', level: 2 },                         // Orange
  { name: 'Totál Overdose', class: 'threat-critical', level: 3 }               // Red (vibrates)
]
```

**Auto-escalation:** Cycles through levels every 8 seconds (line 558)

### 4. Subject/Character System (Lines 300-309)
Eight randomized Czech street slang characters:
- "Šlehař Delta-Piko"
- "Hulič Zubatá Žárovka"
- "Sajrajtový Špiritus X"
- etc.

**Rotation:** Changes on each "scan" completion

### 5. Activity Log System (Lines 318-330, 354-367)
- 40+ pre-written Czech slang phrases
- Dynamic variable substitution (`{BPM}`, `{RISK}`)
- Color-coded severity levels (info, warn, error, critical, ai, profile)
- Auto-scrolling with 15-entry limit
- Timestamps in `cs-CZ` locale

### 6. Biometric Stats (Lines 248-250)
- **TEPÍK (Heart Rate):** Random 70-160 BPM
- **ŠANCE ŽE RUPNE ŽÍLA (Vein Rupture Risk):** Random 10-95%

### 7. AI Integration (Lines 478-540)
Two AI-powered features (requires Gemini API key):

**a) Threat Analysis (Lines 492-515)**
- Triggered on high/critical threat levels
- Generates humorous "dealer advice" based on current stats
- Fallback to hardcoded response if API fails

**b) Subject Profile (Lines 517-540)**
- Character backstory generation
- Police database parody format
- Includes origin, abilities, weaknesses

**Prompt Engineering:**
- System role: "starý, ošlehaný pouliční dealer"
- Context injection: subject name, threat level, biometrics
- Tone enforcement: "drsný a vtipný", uses specific Czech slang

### 8. Accessibility Features
- **Prefers-reduced-motion support** (lines 197-199, 298)
- Disables animations for users with motion sensitivity
- ARIA labels and semantic HTML
- Keyboard navigation (ESC to close modal)

---

## Code Architecture Patterns

### State Management
**Global State Variables (Lines 296-298):**
```javascript
let isProcessing = false;      // Prevents concurrent operations
let currentThreatIndex = 0;    // Tracks current threat level
```

**Element References (Lines 274-294):**
- All DOM elements cached at initialization
- Stored in `elements` object for clean access

### Animation Control
**Debouncing (Lines 336-342, 542-544):**
```javascript
const debouncedScan = debounce(runScanSequence, 600);
```
Prevents rapid-fire button clicks and duplicate API calls.

### Async/Await Pattern
**API Calls (Lines 478-490):**
```javascript
async function callGeminiAPI(prompt) {
  const response = await fetch(apiUrl, {...});
  return result.candidates[0].content.parts[0].text;
}
```

### Event-Driven Architecture (Lines 546-551)
- DOMContentLoaded initialization
- Button click handlers with debouncing
- Modal management (click outside, ESC key)
- Auto-updating intervals (blips, threat levels)

---

## Styling System

### CSS Custom Properties (Lines 132-141)
**Color Palette:**
```css
--bg-gradient-start: #0a192f;    /* Dark navy */
--bg-gradient-mid: #0d4e5a;      /* Teal */
--bg-gradient-end: #4a0e4e;      /* Purple */
--accent-blue: #00f6ff;          /* Cyan glow */
--accent-purple: #a855f7;        /* Magenta */
```

**Glow Effects:**
```css
--glow-blue: rgba(0, 246, 255, 0.35);
--glow-purple: rgba(168, 85, 247, 0.4);
```

### Glassmorphism (Lines 155-158)
```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
}
```

### Safe Area Insets (Lines 140-141, 202)
Handles notches on modern smartphones:
```css
padding-top: calc(var(--safe-area-top) + 1rem);
padding-bottom: calc(var(--safe-area-bottom) + 1rem);
```

---

## Development Workflows

### Local Development
1. **No build required** - Open `index.html` directly in browser
2. **Live editing** - Refresh browser to see changes
3. **No dependencies** - All external resources from CDN

### Testing Checklist
- [ ] Test on mobile viewport (375px - 428px)
- [ ] Verify PWA icon generation
- [ ] Check reduced motion preferences
- [ ] Test without API key (fallback messages)
- [ ] Validate Czech character encoding (UTF-8)
- [ ] Test modal interactions (click outside, ESC key)
- [ ] Verify animation performance (60fps target)

### Deployment
**Static Hosting Options:**
- GitHub Pages (current setup)
- Netlify
- Vercel
- Cloudflare Pages

**Required Files:** Only `index.html`

**Environment Variables:**
- Gemini API key at line 479 (hardcoded in source)
- **Security Warning:** API key exposed in client-side code

---

## Key Conventions for AI Assistants

### Language & Localization
1. **All user-facing text MUST be in Czech**
2. **Use authentic Czech street slang:**
   - piko (pervitin/meth)
   - šleh/šlehař (injection/injector)
   - matroš (drugs)
   - fízl (police)
   - smažák (drug addict, lit. "fried one")
   - na šrot (wasted, broken)

3. **Maintain dark humor tone** - Satirical but not instructional
4. **Character names** - Should follow pattern: `[Slang Term] + [Quirky Modifier]`

### Code Style
1. **Preserve single-file architecture** - Do not split into modules
2. **Inline styles in `<style>` tag** - No external CSS files
3. **Inline scripts in `<script>` tags** - No external JS files
4. **Use const/let, never var**
5. **Arrow functions preferred** for callbacks
6. **Template literals** for string interpolation
7. **Semicolons required** - Not optional

### Naming Conventions
- **DOM elements:** camelCase (e.g., `scanButton`, `modalContent`)
- **CSS classes:** kebab-case (e.g., `glass-panel`, `threat-low`)
- **Functions:** camelCase with verb prefix (e.g., `updateThreatLevel`, `createBlips`)
- **Constants:** camelCase arrays/objects (e.g., `threatLevels`, `subjects`)

### Animation Guidelines
1. **Always check `prefersReducedMotion`** before adding animations
2. **Disable animations** if user prefers reduced motion
3. **Provide static alternatives** for animated content
4. **Keep animation durations under 2 seconds**
5. **Use cubic-bezier easing** for smooth, professional feel

### API Integration Rules
1. **Always provide fallback content** for API failures
2. **Show loading states** (spinner at line 191-194)
3. **Handle rate limiting gracefully**
4. **Never expose real API keys** in production code
5. **Use try/catch for all async operations**

### Accessibility Requirements
1. **Semantic HTML** - Use proper heading hierarchy
2. **ARIA labels** for icon-only buttons
3. **Keyboard navigation** - All interactive elements must be focusable
4. **Color contrast** - Minimum 4.5:1 for text
5. **Focus indicators** - Visible keyboard focus states

---

## Common Modification Scenarios

### Adding New Threat Levels
1. Add to `threatLevels` array (line 311)
2. Define CSS class in `.threat-*` rules (lines 185-188)
3. Update modal trigger logic (line 411)

### Adding New Subjects/Characters
1. Add to `subjects` array (line 300)
2. Follow naming pattern: `{ name: '[Czech Slang]', avatar: '[SHORT]' }`
3. Keep avatar text under 8 characters for visibility

### Adding New Log Phrases
1. Add to `logPhrases` array (line 318)
2. Use `{BPM}` or `{RISK}` for dynamic values
3. Keep phrases under 60 characters for readability

### Modifying Colors
1. Update CSS custom properties in `:root` (line 132)
2. Maintain glow/shadow consistency
3. Ensure WCAG AA contrast compliance

### Adding New AI Features
1. Create new async function following `callGeminiAPI` pattern
2. Add debounced wrapper
3. Implement loading state and error handling
4. Add fallback content
5. Log activity in activity log

---

## Security Considerations

### Current Vulnerabilities
1. **Exposed API Key (Line 479)**
   - Client-side code exposes Gemini API key
   - **Mitigation:** Use serverless function or backend proxy

2. **No Input Sanitization**
   - AI-generated content inserted as innerHTML
   - **Risk:** Potential XSS if API returns malicious content
   - **Mitigation:** Use textContent or DOMPurify library

3. **CORS Dependency**
   - Direct API calls from client require CORS
   - **Alternative:** Backend proxy for API requests

### Recommended Improvements
1. Move API key to environment variable/backend
2. Implement rate limiting on client side
3. Add Content Security Policy headers
4. Sanitize all AI-generated content before DOM insertion
5. Use subresource integrity (SRI) for CDN resources

---

## Performance Optimization

### Current Optimizations
- Debounced user interactions (600ms)
- Element reference caching
- Conditional animation rendering (reduced motion)
- Limited activity log entries (max 15)
- Controlled blip generation (max 12)

### Potential Improvements
1. **Lazy load Google Fonts** - Font-display: swap
2. **Cache API responses** - localStorage for repeated prompts
3. **Intersection Observer** - Pause animations when off-screen
4. **Service Worker** - True offline PWA capability
5. **Image optimization** - Replace canvas with pre-generated PNG

---

## Debugging Tips

### Common Issues
1. **Animations not working:**
   - Check `prefersReducedMotion` setting
   - Verify CSS keyframes are defined
   - Check browser DevTools console for errors

2. **AI features failing:**
   - Verify API key is set (line 479)
   - Check network tab for CORS errors
   - Review API quota limits

3. **PWA not installing:**
   - Verify manifest blob creation
   - Check browser console for manifest errors
   - Ensure HTTPS (required for PWA)

4. **Layout issues on mobile:**
   - Test safe-area-inset support
   - Verify viewport meta tag
   - Check TailwindCSS responsive classes

### Browser DevTools Breakpoints
- Line 423: Start of scan sequence
- Line 478: API call function
- Line 400: Threat level update
- Line 369: Blip creation

---

## Git Workflow

### Branch Naming
Follow pattern: `claude/[feature-description]-[session-id]`

Example: `claude/add-claude-documentation-H9K2q`

### Commit Message Guidelines
- Use imperative mood ("Add feature" not "Added feature")
- Reference Czech terminology when relevant
- Keep first line under 72 characters
- Add detailed body for complex changes

### Push Requirements
1. Always use `git push -u origin <branch-name>`
2. Branch must start with `claude/`
3. Branch must end with matching session ID
4. Retry up to 4 times with exponential backoff on network errors

---

## Testing User Flows

### Primary User Journey
1. User opens app → Scanner initializes
2. User clicks "Najdi nejbližšího smážu" → Scan animation runs
3. Threat level auto-escalates → Visual feedback changes
4. At high/critical level → "Poradna od dealerů" button appears
5. User clicks AI button → Modal opens with generated advice
6. User clicks profile button → Modal shows character backstory

### Edge Cases to Test
- Rapid button clicking (debouncing)
- Network failure during API call (fallback content)
- Modal dismissal methods (X button, click outside, ESC key)
- Long AI responses (modal scrolling)
- Repeated scans (subject rotation, log limit)

---

## Cultural Context

### Czech Street Slang Reference
- **matroš** - drugs (from "materiál")
- **šlehař** - person who injects drugs
- **smažák/smazka** - drug addict (fried brain)
- **piko** - pervitin (methamphetamine)
- **fízl** - police officer (derogatory)
- **na šrot** - wasted, destroyed
- **lajnu** - line (of drugs)
- **dealer** - drug dealer
- **perník** - pervitin

### Humor Style
- **Dark satire** of drug culture
- **Cyberpunk aesthetics** + street reality
- **Exaggerated medical terminology** (biometrics, threat levels)
- **Bureaucratic language** mixed with slang (profile generation)

---

## API Documentation

### Gemini AI API Usage

**Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here"
        }
      ]
    }
  ]
}
```

**Response Structure:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Generated response"
          }
        ]
      }
    }
  ]
}
```

**Rate Limits:** Check Google AI Studio documentation
**Cost:** Free tier available, usage limits apply

---

## Frequently Asked Questions

### Q: Why is everything in one file?
**A:** Single-file architecture simplifies deployment and eliminates build complexity. Ideal for quick prototypes and static hosting.

### Q: Can I use this with a different AI provider?
**A:** Yes, replace `callGeminiAPI()` function with your provider's API client. Ensure similar prompt/response handling.

### Q: How do I change the language to English?
**A:** Replace all text strings in:
- Line 6: `<title>`
- Line 206: Main heading
- Lines 300-309: `subjects` array
- Lines 311-316: `threatLevels` array
- Lines 318-330: `logPhrases` array
- Lines 499-528: AI prompts

### Q: Is this production-ready?
**A:** No. Current issues:
- Exposed API key
- No input sanitization
- No error boundaries
- No analytics
- No A/B testing infrastructure

### Q: Can I monetize this?
**A:** Check Google Gemini API terms of service. Current code uses free tier which may have commercial restrictions.

---

## Changelog & Version History

### v1.0 (Current)
- Initial release
- Core scanner interface
- 4 threat levels
- 8 character subjects
- Gemini AI integration
- PWA icon generation
- Czech localization

### Future Enhancements (Roadmap)
- [ ] Backend API proxy for secure key storage
- [ ] Service worker for offline functionality
- [ ] Analytics integration (privacy-respecting)
- [ ] Multiple language support
- [ ] Shareable results (social media cards)
- [ ] User customization (theme colors)
- [ ] Sound effects toggle
- [ ] Historical scan results storage

---

## Contact & Support

**Repository:** https://github.com/Martyparty1988/Najdismazu
**Issues:** https://github.com/Martyparty1988/Najdismazu/issues
**License:** [Check repository for license file]

---

## AI Assistant Checklist

Before making changes, verify:
- [ ] I understand the satirical/humorous context
- [ ] I'm maintaining Czech language for user-facing text
- [ ] I'm preserving single-file architecture
- [ ] I'm checking `prefersReducedMotion` for animations
- [ ] I'm adding error handling for async operations
- [ ] I'm updating this CLAUDE.md if adding new patterns
- [ ] I'm testing on mobile viewport
- [ ] I'm following existing naming conventions
- [ ] I'm not exposing sensitive data in client code
- [ ] I'm adding appropriate comments for complex logic

---

**Last Updated:** 2026-01-05
**Document Version:** 1.0
**Maintained By:** AI Assistants working on Najdismazu
