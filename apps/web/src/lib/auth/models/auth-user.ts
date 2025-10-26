import type { User } from '@web/lib/clients/auth.client';

/**
 * Domain model for authenticated user
 * Transforms raw auth data into UI-friendly format
 */
export class AuthUser {
  constructor(private readonly user: User) {}

  get id() {
    return this.user.id;
  }

  get email() {
    return this.user.email;
  }

  // Generate initials from user data
  get initials() {
    const name = this.user.name || this.user.email;

    if (!name)
      return '?';

    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }

    const parts = name.split(' ').filter(part => part.trim().length > 0);
    if (parts.length === 1)
      return parts[0]?.charAt(0).toUpperCase() || '?';
    return (
      ((parts[0]?.charAt(0) || '') + (parts[parts.length - 1]?.charAt(0) || '')).toUpperCase()
      || '?'
    );
  }

  // Get user display name - only show if we have a real name (not email)
  get displayName() {
    if (!this.user?.name)
      return null;

    // Only return name if it exists and is not an email address
    if (this.user.name && !this.user.name.includes('@')) {
      return this.user.name;
    }
    return null;
  }

  get createdAt() {
    return this.user.createdAt;
  }

  get avatarUrl() {
    return this.user.image ?? null;
  }

  get role() {
    return this.user.role;
  }

  get isAdmin() {
    return this.user.role === 'admin';
  }
}
