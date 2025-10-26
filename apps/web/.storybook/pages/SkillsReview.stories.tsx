import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';
import React from 'react';

import type { AuthUser } from '@web/lib/auth/models/auth-user';
import type { SkillData } from '@web/pages/public/home/models/skill-package';

import { SkillsReviewPage } from '@web/pages/shared/skills-review';

// Mock auth context
const mockAdminUser: AuthUser = {
  id: 'admin-1',
  email: 'admin@conduit8.dev',
  name: 'Admin User',
  avatarUrl: null,
  role: 'admin',
  createdAt: new Date().toISOString(),
  user: {
    id: 'admin-1',
    email: 'admin@conduit8.dev',
    name: 'Admin User',
    image: null,
    role: 'admin',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  get isAdmin() {
    return this.role === 'admin';
  },
} as AuthUser;

const mockRegularUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'Regular User',
  avatarUrl: null,
  role: 'user',
  createdAt: new Date().toISOString(),
  user: {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Regular User',
    image: null,
    role: 'user',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  get isAdmin() {
    return this.role === 'admin';
  },
} as AuthUser;

// Mock skill data
const mockPendingSkills: SkillData[] = [
  {
    id: 'pending-1',
    slug: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Automatically review code for common issues and best practices',
    category: 'development',
    author: 'John Doe',
    authorUrl: '/profile/john',
    downloadCount: 0,
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'pending-2',
    slug: 'api-tester',
    name: 'API Tester',
    description: 'Test REST APIs and generate documentation',
    category: 'development',
    author: 'Jane Smith',
    authorUrl: '/profile/jane',
    downloadCount: 0,
    status: 'pending',
    submittedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 'pending-3',
    slug: 'schema-validator',
    name: 'Schema Validator',
    description: 'Validate JSON schemas and generate TypeScript types',
    category: 'data',
    author: 'Bob Wilson',
    authorUrl: '/profile/bob',
    downloadCount: 0,
    status: 'pending',
    submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

const mockApprovedSkills: SkillData[] = [
  {
    id: 'approved-1',
    slug: 'docker-helper',
    name: 'Docker Helper',
    description: 'Manage Docker containers and compose files',
    category: 'development',
    author: 'Alice Johnson',
    authorUrl: '/profile/alice',
    downloadCount: 45,
    status: 'approved',
    submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: 'approved-2',
    slug: 'git-flow',
    name: 'Git Flow',
    description: 'Automate git workflows and branch management',
    category: 'development',
    author: 'Charlie Brown',
    authorUrl: '/profile/charlie',
    downloadCount: 128,
    status: 'approved',
    submittedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
];

const mockRejectedSkills: SkillData[] = [
  {
    id: 'rejected-1',
    slug: 'broken-skill',
    name: 'Broken Skill',
    description: 'This skill had errors and was rejected',
    category: 'content',
    author: 'Dave Davis',
    authorUrl: '/profile/dave',
    downloadCount: 0,
    status: 'rejected',
    submittedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
];

const mockUserSubmissions: SkillData[] = [
  {
    id: 'user-pending-1',
    slug: 'my-pending-skill',
    name: 'My Pending Skill',
    description: 'A skill waiting for review',
    category: 'development',
    author: 'Regular User',
    authorUrl: '/profile/user-1',
    downloadCount: 0,
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'user-approved-1',
    slug: 'my-approved-skill',
    name: 'My Approved Skill',
    description: 'A skill that was approved',
    category: 'content',
    author: 'Regular User',
    authorUrl: '/profile/user-1',
    downloadCount: 5,
    status: 'approved',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'user-rejected-1',
    slug: 'my-rejected-skill',
    name: 'My Rejected Skill',
    description: 'A skill that was rejected',
    category: 'data',
    author: 'Regular User',
    authorUrl: '/profile/user-1',
    downloadCount: 0,
    status: 'rejected',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Mock useAuth hook
jest.mock('@web/lib/auth/hooks', () => ({
  useAuth: () => ({
    user: (window as any).__STORYBOOK_USER__ || null,
    isAuthenticated: !!(window as any).__STORYBOOK_USER__,
    isLoading: false,
  }),
}));

// Mock useLoginModal hook
jest.mock('@web/pages/public/home/hooks/use-login-modal', () => ({
  useLoginModal: () => ({
    isOpen: false,
    openLoginModal: () => {},
    closeLoginModal: () => {},
  }),
}));

const meta: Meta<typeof SkillsReviewPage> = {
  title: 'Pages/Skills Review',
  component: SkillsReviewPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SkillsReviewPage>;

// Admin View - Pending Skills
export const AdminViewPending: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', () => {
          return HttpResponse.json({
            success: true,
            data: mockPendingSkills,
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockAdminUser;
    return <SkillsReviewPage />;
  },
};

// Admin View - Approved Skills
export const AdminViewApproved: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', () => {
          return HttpResponse.json({
            success: true,
            data: mockApprovedSkills,
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockAdminUser;
    return <SkillsReviewPage />;
  },
};

// Admin View - Rejected Skills
export const AdminViewRejected: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', () => {
          return HttpResponse.json({
            success: true,
            data: mockRejectedSkills,
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockAdminUser;
    return <SkillsReviewPage />;
  },
};

// Admin View - Empty State
export const AdminViewEmpty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', () => {
          return HttpResponse.json({
            success: true,
            data: [],
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockAdminUser;
    return <SkillsReviewPage />;
  },
};

// Admin View - Loading State
export const AdminViewLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', async () => {
          await delay('infinite');
          return HttpResponse.json({
            success: true,
            data: mockPendingSkills,
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockAdminUser;
    return <SkillsReviewPage />;
  },
};

// User View - With Submissions
export const UserViewWithSubmissions: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', () => {
          return HttpResponse.json({
            success: true,
            data: mockUserSubmissions,
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockRegularUser;
    return <SkillsReviewPage />;
  },
};

// User View - Empty State
export const UserViewEmpty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', () => {
          return HttpResponse.json({
            success: true,
            data: [],
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockRegularUser;
    return <SkillsReviewPage />;
  },
};

// User View - Loading State
export const UserViewLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/skills', async () => {
          await delay('infinite');
          return HttpResponse.json({
            success: true,
            data: mockUserSubmissions,
          });
        }),
      ],
    },
  },
  render: () => {
    (window as any).__STORYBOOK_USER__ = mockRegularUser;
    return <SkillsReviewPage />;
  },
};
