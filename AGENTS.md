# Glifo

Preserve the celestial authorial identity and the supplied final mark geometry.

- Read DESIGN.md before visual changes. Keep primitive tokens in src/styles/tokens.css.
- Keep project and contact content in src/data/site.ts. Never invent clients, results or contact channels.
- A property has one animation owner. The Canvas owns stars; GSAP owns coordinated transitions. Pause loops offscreen and honor reduced motion.
- Keep direct links and keyboard access equivalent to visual exploration.
- Do not commit dist, node_modules, local secrets or test results. Fonts carry OFL notices.
- Run npm run check, npm run build and the appropriate Playwright tests after meaningful implementation changes.
- Deployment is configured for Cloudflare Workers static assets. Preserve the chosen provider and do not introduce other hosting identities.
