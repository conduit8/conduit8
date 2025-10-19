import { homedir } from 'node:os';
import { join } from 'node:path';

export const SKILLS_DIR = join(homedir(), '.claude', 'skills');
export const API_BASE_URL = 'https://conduit8.com/api';

// Stub: Dummy skill data for testing
export const DUMMY_SKILLS = [
  {
    id: 'pdf',
    name: 'PDF Toolkit',
    description: 'Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.',
    category: 'documents',
    author: 'anthropic',
    authorKind: 'official' as const,
    zipSize: 2457600,
    downloadCount: 234,
    examples: [
      'Extract tables: "Get revenue table from Q4-report.pdf"',
      'Merge PDFs: "Combine all PDFs in contracts/ folder"',
      'Fill forms: "Fill W-9 with company details"',
    ],
  },
  {
    id: 'algorithmic-art',
    name: 'Algorithmic Art',
    description: 'Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration.',
    category: 'creative',
    author: 'anthropic',
    authorKind: 'official' as const,
    zipSize: 1024000,
    downloadCount: 189,
    examples: [
      'Generate art: "Create a flow field visualization"',
      'Particle system: "Make an interactive particle system"',
      'Abstract shapes: "Generate abstract geometric art"',
    ],
  },
  {
    id: 'webapp-testing',
    name: 'Web Testing',
    description: 'Toolkit for interacting with and testing local web applications using Playwright.',
    category: 'testing',
    author: 'anthropic',
    authorKind: 'official' as const,
    zipSize: 3145728,
    downloadCount: 156,
    examples: [
      'Test UI: "Test the login flow on localhost:3000"',
      'Debug app: "Check if the submit button is visible"',
      'Screenshot: "Take a screenshot of the dashboard"',
    ],
  },
  {
    id: 'xlsx',
    name: 'Spreadsheet Toolkit',
    description: 'Process Excel files, extract data, create spreadsheets with Python and pandas.',
    category: 'documents',
    author: 'community',
    authorKind: 'community' as const,
    zipSize: 1536000,
    downloadCount: 98,
    examples: [
      'Extract data: "Get sales data from Q4-report.xlsx"',
      'Create report: "Generate summary spreadsheet from CSV files"',
      'Analyze data: "Calculate totals and averages in Excel file"',
    ],
  },
];
