## Run the project
- Install: `npm install`
- Dev server: `npm run dev`
- run server: `npm start`
- Production build: `npm run build`

## Architecture
- `src/App.jsx` holds all app state (tasks, filters, sorting, modal, toast) using `useState`.
- `src/components/ui/` contains small, reuseable primitives (Button, inputs, Card, Modal, Toast, Tag/Badge) styled with SCSS variables.
- `src/components/board/` renders the columns, task cards, and the create/edit modal.
- `src/utils/storage.js` wraps localStorage with schemaVersion + migration; `src/utils/format.js` handles time/priority helpers.
- `src/styles/` centralizes SCSS variables and global theming.
