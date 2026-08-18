# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

🚀 What I recommend we do NOW

Don't try to build everything at once.

Phase 1 — Core adoption system

✅ Home/Dashboard
✅ Login
✅ Pets
✅ Pet Details
🔜 Adoption form → connect to backend
🔜 Save adoption request to MongoDB
🔜 Admin adoption requests
🔜 Approve/Reject adoption

Phase 2

Admin pet management
Real pet image upload
Search/filter pets

Phase 3

Donations
Appointments
Profile
Notifications
Final responsive UI

That will turn what you currently have into a proper full-stack PawConnect application, rather than just separate frontend pages.