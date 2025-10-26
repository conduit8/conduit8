import type { Meta, StoryObj } from '@storybook/react-vite';

import { AuthUser } from '@web/lib/auth/models';
import { UserAvatar } from '@web/ui/components/overlays/user-dropdown/user-avatar';

// Create mock AuthUser instances
const mockUsers = {
  withGithubAvatar: new AuthUser({
    id: '123',
    email: 'github-user@example.com',
    name: 'GitHub User',
    image: 'https://avatars.githubusercontent.com/u/583231?v=4',
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  withGoogleAvatar: new AuthUser({
    id: '456',
    email: 'google-user@example.com',
    name: 'Google User',
    image: 'https://lh3.googleusercontent.com/a/ACg8ocLFPU9hxUJe2jgYQrTKzFmS7fiFDJ=s96-c',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  emailUserWithName: new AuthUser({
    id: '789',
    email: 'email-user@example.com',
    name: 'Email User',
    image: null,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  emailUserNoName: new AuthUser({
    id: '101',
    email: 'no-name@example.com',
    name: null,
    image: null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  userWithLongName: new AuthUser({
    id: '202',
    email: 'long-name@example.com',
    name: 'User With A Very Long Name That Should Be Truncated',
    image: null,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
};

const meta = {
  title: 'Components/Auth/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the avatar',
    },
    variant: {
      control: 'select',
      options: ['default', 'image-only'],
      description: 'Variant of the avatar display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples with different user types
export const GitHubUser: Story = {
  args: {
    user: mockUsers.withGithubAvatar,
    size: 'md',
    variant: 'default',
  },
};

export const GoogleUser: Story = {
  args: {
    user: mockUsers.withGoogleAvatar,
    size: 'md',
    variant: 'default',
  },
};

export const EmailUserWithInitials: Story = {
  args: {
    user: mockUsers.emailUserWithName,
    size: 'md',
    variant: 'default',
  },
};

export const EmailUserWithEmailInitial: Story = {
  args: {
    user: mockUsers.emailUserNoName,
    size: 'md',
    variant: 'default',
  },
};

export const ImageOnlyVariant: Story = {
  args: {
    user: mockUsers.withGithubAvatar,
    size: 'md',
    variant: 'image-only',
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-1">
        <UserAvatar user={mockUsers.withGithubAvatar} size="sm" />
        <span className="text-xs">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <UserAvatar user={mockUsers.withGithubAvatar} size="md" />
        <span className="text-xs">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <UserAvatar user={mockUsers.withGithubAvatar} size="lg" />
        <span className="text-xs">lg</span>
      </div>
    </div>
  ),
};

// Variant examples
export const VariantExamples: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGoogleAvatar} variant="default" />
        <span className="text-xs">Default (with name)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGoogleAvatar} variant="image-only" />
        <span className="text-xs">Image Only</span>
      </div>
    </div>
  ),
};

// Fallback variations (initials)
export const FallbackVariations: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1">
        <UserAvatar user={mockUsers.emailUserWithName} />
        <span className="text-xs">Name Initials</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <UserAvatar user={mockUsers.emailUserNoName} />
        <span className="text-xs">Email Initial</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <UserAvatar user={mockUsers.userWithLongName} />
        <span className="text-xs">Long Name</span>
      </div>
    </div>
  ),
};

// Badge variations
export const WithBadge: Story = {
  args: {
    user: mockUsers.withGithubAvatar,
    size: 'md',
    variant: 'image-only',
    badgeCount: 3,
  },
};

export const BadgeVariations: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGithubAvatar} variant="image-only" badgeCount={0} />
        <span className="text-xs">No badge</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGithubAvatar} variant="image-only" badgeCount={3} />
        <span className="text-xs">3 pending</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.emailUserWithName} variant="image-only" badgeCount={12} />
        <span className="text-xs">12 pending</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGoogleAvatar} variant="image-only" badgeCount={99} />
        <span className="text-xs">99 pending</span>
      </div>
    </div>
  ),
};

export const BadgeOnDefaultVariant: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGithubAvatar} variant="default" badgeCount={0} />
        <span className="text-xs">No badge</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar user={mockUsers.withGithubAvatar} variant="default" badgeCount={5} />
        <span className="text-xs">With badge</span>
      </div>
    </div>
  ),
};

// Integration example
export const IntegrationExample: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      {/* Header with avatar */}
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
        <div className="flex items-center gap-3">
          <UserAvatar user={mockUsers.withGithubAvatar} size="md" badgeCount={2} />
          <div>
            <div className="font-medium">GitHub User</div>
            <div className="text-sm text-gray-500">github-user@example.com</div>
          </div>
        </div>
        <button className="text-sm text-blue-600">Sign Out</button>
      </div>

      {/* Comment with avatar */}
      <div className="flex gap-3 rounded-lg bg-gray-50 p-4">
        <UserAvatar user={mockUsers.withGoogleAvatar} size="sm" />
        <div className="flex-1">
          <div className="font-medium">Google User</div>
          <div className="mt-1 text-sm text-gray-700">
            This is an example comment showing how the avatar can be used in a comment thread.
          </div>
        </div>
      </div>

      {/* User list with avatars */}
      <div className="divide-y rounded-lg bg-white shadow">
        <div className="p-4 font-medium">Team Members</div>
        {Object.values(mockUsers).map((user, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <UserAvatar user={user} size="sm" />
            <div>
              <div className="font-medium">
                {user.displayName || user.email}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
