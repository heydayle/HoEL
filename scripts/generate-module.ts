import fs from 'fs';
import path from 'path';

// Lấy tên module từ command line argument
const moduleName: string | undefined = process.argv[2];

if (!moduleName) {
  console.error('❌ Please provide a module name!');
  console.log('💡 Example: npm run gen:module dashboard');
  process.exit(1);
}

// Chuyển đổi tên module sang PascalCase (vd: dashboard -> Dashboard)
const capitalizeName: string = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// Định nghĩa đường dẫn gốc của module
const basePath: string = path.join(process.cwd(), 'app', 'modules', moduleName);

// 1. Cấu trúc các thư mục cần tạo
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
// 2. TẠO CÁC FILE BOILERPLATE CƠ BẢN
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
// 3. TẠO TẦNG UI / PAGES (Kèm Test & Styled)
// ==========================================

// File: ui/pages/index.tsx
const pageContent: string = `import { ${capitalizeName}Container, PageTitle } from './styled';
import { ExampleComponent } from '../components/ExampleComponent';

/**
 * Main entry page component for the ${capitalizeName} module
 * @returns {JSX.Element} The rendered page component
 */
export default function ${capitalizeName}Page(): JSX.Element {
  return (
    <${capitalizeName}Container>
      <PageTitle>${capitalizeName} Module</PageTitle>
      <ExampleComponent />
    </${capitalizeName}Container>
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

// File: ui/pages/styled.tsx (Single styled file rule)
const pageStyledContent: string = `import styled from 'styled-components';

/**
 * Main container for the ${capitalizeName} page
 */
export const ${capitalizeName}Container = styled.div\`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  min-height: 100vh;
  background-color: var(--background);
\`;

/**
 * Styled title using deep color tones
 */
export const PageTitle = styled.h1\`
  font-size: 2rem;
  font-weight: 600;
  color: var(--deep-gray-900);
  
  /* Dark mode support */
  .dark & {
    color: var(--neutral-100);
  }
\`;
`;
fs.writeFileSync(path.join(basePath, 'ui/pages', 'styled.tsx'), pageStyledContent);

// ==========================================
// 4. TẠO TẦNG UI / COMPONENTS (Kèm Test & Styled + Shadcn wrapper)
// ==========================================

// File: ui/components/ExampleComponent.tsx
const componentContent: string = `import { ActionCard, CustomButton } from './styled';

/**
 * Example component demonstrating the use of styled shadcn components
 * @returns {JSX.Element} The rendered component
 */
export const ExampleComponent = (): JSX.Element => {
  return (
    <ActionCard>
      <p>This is a reusable component for ${moduleName}.</p>
      <CustomButton variant="default">Click Me</CustomButton>
    </ActionCard>
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

// File: ui/components/styled.tsx (Single styled file rule + Shadcn integration)
const componentStyledContent: string = `import styled from 'styled-components';
// Giả định bạn đã cấu hình export Card, Button từ app/shared/components/Styled
import { Card, Button } from '@/app/shared/components/Styled';

/**
 * Custom styled wrapper for Shadcn Card
 */
export const ActionCard = styled(Card)\`
  margin-top: 16px;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--deep-gray-800);
  border: 1px solid var(--deep-gray-700);
\`;

/**
 * Custom styled wrapper for Shadcn Button
 */
export const CustomButton = styled(Button)\`
  margin-top: 12px;
  width: 100%;
  font-weight: bold;
\`;
`;
fs.writeFileSync(path.join(basePath, 'ui/components', 'styled.tsx'), componentStyledContent);

console.log(`\n🎉 Enterprise Module "${moduleName}" generated successfully!`);
console.log(`📁 Location: app/modules/${moduleName}`);
console.log(`🧪 Run tests via: npm run test`);