# The Hoosier Help-O-Matic Wireframe

## Project purpose
This is a plain HTML, CSS, and vanilla JavaScript wireframe portal for the State of Indiana. It is designed to help citizens find services near them and preview a registration-to-application journey with mock-only interactions.

## Audience
Indiana residents looking for nearby services and program support information.

## Page map
- Home: `index.html`
- Registration: `pages/registration.html`
- Login: `pages/login.html`
- Address Search: `pages/address.html`
- Dashboard: `pages/dashboard.html`
- Profile: `pages/profile.html`
- Application Form: `pages/application-form.html`
- Directions: `pages/directions-salesforce-tower.html`
- FAQ: `pages/faq.html`

## Color palette used
Palette name: Hoosier Civic Bright
- Primary: `#0F3D6E`
- Secondary: `#1F7A8C`
- Accent: `#F4A300`
- Surface: `#F7FAFC`
- Background: `#E9F1F7`
- Text: `#1E293B`
- Success: `#2E7D32`
- Warning: `#B7791F`
- Error: `#C53030`

## Implemented first user story (assumed)
As a new applicant, I want to register for an account so that I can start an application.

Wireframe implementation:
1. User registers on `pages/registration.html`.
2. Account is stored as mock data in `localStorage`.
3. User is redirected to `pages/login.html`.
4. User logs in with mock email and lands on `pages/dashboard.html`.

## Key interactive features
- Mobile nav menu toggle (`js/main.js`)
- Shared local chatbot with placeholder replies across portal pages (`js/main.js`)
- Address search bar with mock service filtering (`js/address.js`)
- Document upload UI with drag/drop and remove actions (`js/application-form.js`)
- FAQ accordion interactions (`js/faq.js`)

## Chatbot live API notes
- Endpoint used: `https://mfobabs5n0.execute-api.us-east-2.amazonaws.com/dev/ask`
- Request payload keys: `prompt`, `max_tokens`, `temperature`
- Optional API key support:
	- `window.PORTAL_BEDROCK_API_KEY = "your-key"` before scripts run, or
	- `localStorage.setItem("portalBedrockApiKey", "your-key")` in browser console
- Chatbot sends short conversation memory as context (recent message history) in the `prompt` string.

## How to run
1. Open `portal-demo/index.html` in any modern browser.
2. Navigate using links in the header.

No server, package manager, framework, build step, or external dependency is required.

## How to reset
Delete the `/portal-demo` folder.

## Notes
- All placeholder and wireframe content is marked with `<!-- MOCK -->` comments in HTML.
- Authentication and data persistence are mock-only and not secure by design.
