<p align="center">
  <img src="./public/carpi-black.svg" width="20%" alt="CARPI Logo" />
</p>

<div align="center">
<h1>CARPI Course Planner - Frontend</h1>
  <a href="http://carpi.cs.rpi.edu/">
    <img alt="Visit the website!" src="https://img.shields.io/badge/Website-0373FC?logo=telegram&logoColor=FFFFFF">
  </a>
  <a href="https://opensource.org/license/mit">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-pink">
  </a>
  <a href="https://discord.com/invite/xRBvFHgcYT">
    <img alt="Join our Discord server!" src="https://img.shields.io/discord/1067560508946919564?label=Discord">
  </a>
  <h4>Built for RPI Students</h4>
</div>

Project CARPI, standing for Cool Academic RPI, allows you to plan each semester with our academic calendar menu, easy search of the course catalog, and customizable planner.

## Features

- Search the RPI course catalog with debounced search and filters.
- Filter courses by subject, attributes, and semester availability.
- Drag and drop courses into semester blocks.
- Add/edit/remove semesters and manage course credits.
- Persist planner data in browser local storage with versioned schema support.
- Import/export planner JSON data.
- Responsive experience with desktop/mobile planner behavior.

## Getting Started with Frontend

These instructions will get you a copy of the project's frontend up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you will need **Node.js** and **npm** installed on your machine. This project currently pins tool versions in `package.json` engines:

- Node.js `~24.14.0`
- npm `~11.12.0`

We highly recommend using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) to easily switch between Node versions. You can verify your environment with:

```bash
node -v
npm -v
```

### Installing

1. Clone the repository and navigate into the frontend directory:

```bash
git clone https://github.com/Project-CARPI/site.git
cd project-carpi/site
```

2. Use the correct Node version:
   If you have `nvm` installed, you can simply run the following command to read the `.nvmrc` file and use Node v24.14:

```bash
nvm use
```

3.  Install the dependencies and start the development server.

```bash
npm install
npm run dev
```

By default, Vite serves the app on localhost (usually `http://localhost:5173`).

To expose the app on your local network:

```bash
npm run dev -- --host
```

### Other Available Scripts

- `npm run dev`: Start Vite development server.
- `npm run build`: Type-check and create production build.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint.
- `npm run prettier:check`: Check formatting.
- `npm run prettier:write`: Auto-format files.

## Backend Integration

The frontend uses Axios with a configured base URL:

- `http://carpi.cs.rpi.edu:8000/api/v1/`

Configured in:

- `src/lib/axios.ts`

If you are running a local backend, update the Axios `baseURL` in `src/lib/axios.ts`.

## Project Structure

```text
src/
  components/          # Shared UI components
  core/workspace/      # Planner workspace context, reducers, and persistence utils
  features/
    catalog/           # Catalog search, filters, and result rendering
    planner/           # Planner UI and semester/course interactions
    dnd/               # Drag-and-drop wiring
    toolbox/           # Global toolbox controls
  lib/                 # Shared helpers, API client, types, hooks, stores
  pages/               # Route-level pages (Home, Catalog, Planner)
```

## Build and Deployment

When you are ready to deploy the site to production, run the build command. This will compile the TypeScript files and bundle the project using Vite:

```bash
npm run build
```

The optimized production-ready files will be generated in the `dist/` folder. You can locally preview the production build by running:

```bash
npm run preview
```

## Built With

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) (code formatting)
- [Radix UI](https://www.radix-ui.com/) (basic UI)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [@dnd-kit](https://dndkit.com/) (drag-and-drop)
- [Framer Motion](https://www.framer.com/motion/) (ui animations)
- [Zod](https://zod.dev/) (schema validation)

## Contributing

Please reach out to one of the current developers for information on how to get started on contributing.

## Authors

<a href="https://github.com/Project-CARPI/site/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Project-CARPI/site" />
</a>

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
