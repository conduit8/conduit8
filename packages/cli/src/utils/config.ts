import type { Skill } from '@conduit8/core';

import { homedir } from 'node:os';
import { join } from 'node:path';

export const SKILLS_DIR = join(homedir(), '.claude', 'skills');
export const API_BASE_URL = 'https://conduit8.com/api';

// Stub: Dummy skill data for testing
export const DUMMY_SKILLS: Skill[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'pdf',
    name: 'PDF Toolkit',
    description: 'Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.',
    category: 'documents',
    author: 'anthropic',
    authorKind: 'verified',
    zipUrl: 'https://r2.conduit8.com/skills/pdf.zip',
    downloadCount: 234,
    examples: [
      'Extract tables: "Get revenue table from Q4-report.pdf"',
      'Merge PDFs: "Combine all PDFs in contracts/ folder"',
      'Fill forms: "Fill W-9 with company details"',
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    slug: 'algorithmic-art',
    name: 'Algorithmic Art',
    description: 'Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration.',
    category: 'creative',
    author: 'anthropic',
    authorKind: 'verified',
    zipUrl: 'https://r2.conduit8.com/skills/algorithmic-art.zip',
    downloadCount: 189,
    examples: [
      'Generate art: "Create a flow field visualization"',
      'Particle system: "Make an interactive particle system"',
      'Abstract shapes: "Generate abstract geometric art"',
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    slug: 'webapp-testing',
    name: 'Web Testing',
    description: 'Toolkit for interacting with and testing local web applications using Playwright.',
    category: 'testing',
    author: 'anthropic',
    authorKind: 'verified',
    zipUrl: 'https://r2.conduit8.com/skills/webapp-testing.zip',
    downloadCount: 156,
    examples: [
      'Test UI: "Test the login flow on localhost:3000"',
      'Debug app: "Check if the submit button is visible"',
      'Screenshot: "Take a screenshot of the dashboard"',
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    slug: 'xlsx',
    name: 'Spreadsheet Toolkit',
    description: 'Process Excel files, extract data, create spreadsheets with Python and pandas.',
    category: 'documents',
    author: 'community',
    authorKind: 'community',
    zipUrl: 'https://r2.conduit8.com/skills/xlsx.zip',
    downloadCount: 98,
    examples: [
      'Extract data: "Get sales data from Q4-report.xlsx"',
      'Create report: "Generate summary spreadsheet from CSV files"',
      'Analyze data: "Calculate totals and averages in Excel file"',
    ],
  },
];
