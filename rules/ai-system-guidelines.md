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
    - `usecases/`: Where main business logic is handled (e.g., actions, Zustand/Redux store dispatch functions).
  - `infras/`: Infrastructure layer, contains custom hooks for making HTTP requests (fetch API).
  - `messages/`: Contains locale files (JSON/TS) for multi-language support (i18n), exclusively used for this specific screen/module.
  - `ui/`: The presentation layer of the module.
    - `components/`: Smaller components that make up the page.
    - `hooks/`: Pure custom hooks specifically serving the page's UI logic.
    - `pages/`: The composite component (Smart Component) that will be exported to `app/<page>`.

## 2. UI/UX Design Standards

- **Core UI Library:** Use **shadcn/ui** as the primary foundational UI component library.
- **Centralized Shadcn Components:** All default `shadcn/ui` components must be stored and exported from `app/shared/components/Styled.tsx` (or a dedicated `Styled` directory within shared components) for global access.
- **Styling Engine:** Strictly use **`styled-components`** for all custom styling and layouts across the application.
- **Styling File Structure (The `styled.tsx` Rule):** For every `/ui` or `/components` directory (regardless of the path level or module), there MUST be a single, shared `styled.tsx` file. All custom `styled-components` and styled wrappers for that specific directory must be declared in this file. Do not create separate `.styled.tsx` files for individual components.
- **Customizing Shadcn:** When a `shadcn` component requires custom styling, you must wrap the original component using the `styled(ShadcnComponentName)` syntax inside the shared `styled.tsx` file of that directory (e.g., `export const CustomButton = styled(Button)\`...\`;`).
- **Atomic Design:** The structure of UI components (especially in `app/shared/components`) must strictly follow the Atomic Design methodology.
- **UI Aesthetics:** The interface must have a modern, intuitive design. Prioritize the use of **deep color tones** to provide a premium and refined feel.
- **Theme:** Must fully support and smoothly transition between **Dark Mode** and **Light Mode** across all components.
- **Multi-language (i18n):** All text displayed on the UI must be configured via the i18n system. Hardcoding text directly into components is strictly prohibited.

## 3. Coding Standards & Clean Code

- **TypeScript Strictness:** Strictly adhere to TypeScript typing. Any use of `any` is highly discouraged unless absolutely necessary. Use the `.ts` file extension for hooks, utilities, repositories, use cases, and core logic. Use the `.tsx` file extension strictly and exclusively for React UI components.
- **Single Responsibility Principle (SRP):** Each function, hook, and component must perform **only one single task**. If a function does more than one thing, it must be extracted and split.
- **Clarity:** Code logic must be coherent, readable, and easy to understand. Avoid deeply nested logic. Prioritize early returns to reduce the complexity of code blocks.
- **Documentation & Comments:** **ALWAYS** use standard JSDoc (`/** ... */`) placed directly above every function, variable, type, interface, and component. Clearly describe: the purpose, parameters (`@param`), and return values (`@returns`).
- **Clean Code:** Always run **Prettier** formatting and check with **ESLint** before completing a file. You must review and remove all redundant code, commented-out code (dead code), and unused libraries.
- **ESLint Rules:** ABSOLUTELY DO NOT use flags like `// eslint-disable-next-line` or disable ESLint rules, except in unavoidable circumstances related to 3rd-party library type casting (which must include an explanatory comment next to it).

## 4. Testing & Quality Assurance

Testing is not optional; it is mandatory.

- **Framework:** Use **Jest** (alongside React Testing Library for UI) as the primary framework for building unit tests.
- **Concurrent Creation:** Unit tests must be created concurrently alongside any component, page, hook, or function that contains complex logic. Do not leave testing as an afterthought.
- **Colocation Rule:** All unit test files must reside in the exact same directory as the target object being tested (e.g., `Button.test.tsx` must sit directly next to `Button.tsx`, and `useUser.test.ts` next to `useUser.ts`).
- **Integration Tests:** Must write integration tests for major UI components and user interaction flows.
- **Coverage Target:** Test coverage (Line, Function, Branch) **MUST ALWAYS BE > 90%**. A task is not considered complete until this target is met.
