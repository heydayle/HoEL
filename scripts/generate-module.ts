import fs from 'fs';
import path from 'path';

// Get module name from command line argument
const moduleName: string | undefined = process.argv[2];

if (!moduleName) {
  console.error('❌ Please provide a module name!');
  console.log('💡 Example: npm run gen:module dashboard');
  process.exit(1);
}

// Convert module name to PascalCase (e.g.: dashboard -> Dashboard)
const capitalizeName: string = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// Define the base path for the module
const basePath: string = path.join(process.cwd(), '', 'modules', moduleName);

// 1. Directory structure to create
const directories: string[] = [
  'core/models',
  'core/repositories',
  'core/usecases',
  'infras',
  'messages',
  'ui/components',
  'ui/hooks',
  'ui/pages',
];

console.log(`🚀 Starting to create Enterprise module: ${moduleName}...\n`);

directories.forEach((dir: string) => {
  const fullPath: string = path.join(basePath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`✅ Created directory: ${dir}`);
});

// ==========================================
// 2. CREATE CORE BOILERPLATE FILES
// ==========================================

// --- CORE / MODELS ---
const modelContent: string = `/**
 * Interface representing the core data model for ${capitalizeName}
 */
export interface I${capitalizeName} {
  id: string;
  createdAt: string;
}
`;
fs.writeFileSync(path.join(basePath, 'core/models', 'index.ts'), modelContent);

// --- MESSAGES (i18n) ---
const i18nEnContent: string = `{\n  "title": "${capitalizeName} Module",\n  "greeting": "Welcome to ${moduleName}"\n}`;
fs.writeFileSync(path.join(basePath, 'messages', 'en.json'), i18nEnContent);

const i18nViContent: string = `{\n  "title": "Module ${capitalizeName}",\n  "greeting": "Chào mừng đến với ${moduleName}"\n}`;
fs.writeFileSync(path.join(basePath, 'messages', 'vi.json'), i18nViContent);

// ==========================================
// 3. CREATE UI / PAGES (with Test)
// ==========================================

// File: ui/pages/index.tsx — uses Tailwind CSS
const pageContent: string = `/**
 * Main entry page component for the ${capitalizeName} module
 * @returns The rendered page component
 */
export default function ${capitalizeName}Page(): React.JSX.Element {
  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-background">
      <h1 className="text-3xl font-semibold text-foreground">${capitalizeName} Module</h1>
      <ExampleComponent />
    </main>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'ui/pages', 'index.tsx'), pageContent);

// File: ui/pages/index.test.tsx (Colocated Unit Test)
const pageTestContent: string = `import { render, screen } from '@testing-library/react';
import ${capitalizeName}Page from './index';

describe('${capitalizeName}Page Component', () => {
  /**
   * Test case: Should render the page title correctly
   */
  it('renders the module title', () => {
    render(<${capitalizeName}Page />);
    const heading = screen.getByRole('heading', { name: /${capitalizeName} Module/i });
    expect(heading).toBeInTheDocument();
  });
});
`;
fs.writeFileSync(path.join(basePath, 'ui/pages', 'index.test.tsx'), pageTestContent);

// ==========================================
// 4. CREATE UI / COMPONENTS (with Test)
// ==========================================

// File: ui/components/ExampleComponent.tsx — uses Tailwind CSS
const componentContent: string = `import { Button, Card } from '@/shared/components/Styled';

/**
 * Example component demonstrating the use of shadcn components with Tailwind
 * @returns The rendered component
 */
export const ExampleComponent = (): React.JSX.Element => {
  return (
    <Card className="mt-4 p-5 rounded-xl bg-surface border border-surface-border">
      <p>This is a reusable component for ${moduleName}.</p>
      <Button className="mt-3 w-full font-bold" variant="default">Click Me</Button>
    </Card>
  );
};
`;
fs.writeFileSync(path.join(basePath, 'ui/components', 'ExampleComponent.tsx'), componentContent);

// File: ui/components/ExampleComponent.test.tsx (Colocated Unit Test)
const componentTestContent: string = `import { render, screen } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  /**
   * Test case: Should render the button inside the component
   */
  it('renders the action button', () => {
    render(<ExampleComponent />);
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
  });
});
`;
fs.writeFileSync(path.join(basePath, 'ui/components', 'ExampleComponent.test.tsx'), componentTestContent);

console.log(`\n🎉 Enterprise Module "${moduleName}" generated successfully!`);
console.log(`📁 Location: modules/${moduleName}`);
console.log(`🧪 Run tests via: npm run test`);