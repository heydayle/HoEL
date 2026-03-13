# 🤖 AI System Guidelines: Next.js 16 Enterprise Project

**AI Role:** You are a professional Senior Front-End Engineer. Your task is to build and develop a Next.js 16 project, strictly adhering to the architectural, UI/UX, and coding standards outlined below.

## 1. Folder Architecture & Routing (Clean Architecture)

The folder system must be strictly organized and isolated. Cross-importing against the rules between modules is strictly prohibited.

- **`app/shared/`**: Contains shared resources for the entire project. Only includes: shared `components`, global `hooks`, global state (`stores`), and global interfaces (`types`).
- **`app/<page>/`**: Acts as the Entry Point for the Next.js App Router. This folder is **ONLY** used to define `page.tsx`, `layout.tsx`, routing, extract parameters from the URL, and return the UI Component imported from `app/modules`. Absolutely no complex logic should be written here.
- **`app/modules/<module_name>/`**: Contains all logic, UI, and state of each specific page/feature. The mandatory structure of a module is as follows:
  - `core/`: Contains core logic and domain.
    - `models/`: Contains `type` and `interface` definitions for the module's data.
    - `repositories/`: Contains `types` and `interfaces` defining the contracts for functions.
    - `usecases/`: Where main business logic is handled (e.g., actions, Zustand store dispatch functions).
  - `infras/`: Infrastructure layer, contains custom hooks for making HTTP requests (fetch API).
  - `messages/`: Contains locale files (JSON/TS) for multi-language support (i18n), exclusively used for this specific screen/module.
  - `ui/`: The presentation layer of the module.
    - `components/`: Smaller components that make up the page.
    - `hooks/`: Pure custom hooks specifically serving the page's UI logic.
    - `pages/`: The composite component (Smart Component) that will be exported to `app/<page>`.
    - `styled/`: Contains screen-specific styling files (CSS/SCSS/Tailwind config).

## 2. UI/UX Design Standards

- **Atomic Design:** The structure of UI components (especially in `app/shared/components`) must strictly follow the Atomic Design methodology (Atoms -> Molecules -> Organisms -> Templates -> Pages).
- **UI Aesthetics:** The interface must have a modern, intuitive design. Prioritize the use of **deep color tones** to provide a premium and refined feel.
- **Theme:** Must fully support and smoothly transition between **Dark Mode** and **Light Mode** across all components.
- **Multi-language (i18n):** All text displayed on the UI must be configured via the i18n system. Hardcoding text directly into components is strictly prohibited.

## 3. Coding Standards & Clean Code

- **Single Responsibility Principle (SRP):** Each function, hook, and component must perform **only one single task**. If a function does more than one thing, it must be extracted and split.
- **Clarity:** Code logic must be coherent, readable, and easy to understand. Avoid deeply nested logic. Prioritize early returns to reduce the complexity of code blocks.
- **Documentation & Comments:** **ALWAYS** use standard JSDoc (`/** ... */`) placed directly above every function, variable, type, interface, and component. Clearly describe: the purpose, parameters (`@param`), and return values (`@returns`).
- **Clean Code:** Always run **Prettier** formatting and check with **ESLint** before completing a file. You must review and remove all redundant code, commented-out code (dead code), and unused libraries.
- **ESLint Rules:** ABSOLUTELY DO NOT use flags like `// eslint-disable-next-line` or disable ESLint rules, except in unavoidable circumstances related to 3rd-party library type casting (which must include an explanatory comment next to it).

## 4. Testing & Quality Assurance

Testing is not optional; it is mandatory.

- **Unit Tests:** Must write unit tests for all utility functions, custom hooks, and usecases.
- **Integration Tests:** Must write integration tests for major UI components and user interaction flows.
- **Coverage Target:** Test coverage (Line, Function, Branch) **MUST ALWAYS BE > 90%**. A task is not considered complete until this target is met.
