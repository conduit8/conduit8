/**
 * Centralized Storybook story paths configuration
 * This ensures consistent naming and organization across all stories
 */

export const STORY_PATHS = {
  // Design System - Foundation elements
  DESIGN_SYSTEM: {
    ROOT: 'Design System',
    BRAND: 'Design System/Brand',
    COLORS: 'Design System/Colors',
    TYPOGRAPHY: 'Design System/Typography',
    CURSORS: 'Design System/Cursors',
    TOKENS: 'Design System/Tokens',
    COMPONENTS_OVERVIEW: 'Design System/Components Overview',
  },

  // Components - Organized by atomic design principles
  COMPONENTS: {
    // Atoms - Smallest building blocks
    ATOMS: {
      ROOT: 'Components/Atoms',
      BUTTONS: 'Components/Atoms/Buttons',
      INPUTS: 'Components/Atoms/Inputs',
      BRAND: 'Components/Atoms/Brand',
      INDICATORS: 'Components/Atoms/Indicators',
      TYPOGRAPHY: 'Components/Atoms/Typography',
      BACKGROUNDS: 'Components/Atoms/Backgrounds',
    },

    // Data Display
    DATA: {
      ROOT: 'Components/Data Display',
      TABLES: 'Components/Data Display/Tables',
      CARDS: 'Components/Data Display/Cards',
      LISTS: 'Components/Data Display/Lists',
    },

    // Feedback
    FEEDBACK: {
      ROOT: 'Components/Feedback',
      PROGRESS: 'Components/Feedback/Progress',
      SPINNERS: 'Components/Feedback/Spinners',
      TOASTS: 'Components/Feedback/Toasts',
      ALERTS: 'Components/Feedback/Alerts',
    },

    // Layout
    LAYOUT: {
      ROOT: 'Components/Layout',
      CONTAINERS: 'Components/Layout/Containers',
      GRIDS: 'Components/Layout/Grids',
      SIDEBAR: 'Components/Layout/Sidebar',
      CARDS: 'Components/Layout/Cards',
    },

    // Navigation
    NAVIGATION: {
      ROOT: 'Components/Navigation',
      MENUS: 'Components/Navigation/Menus',
      BREADCRUMBS: 'Components/Navigation/Breadcrumbs',
      TABS: 'Components/Navigation/Tabs',
    },

    // Overlays
    OVERLAYS: {
      ROOT: 'Components/Overlays',
      DIALOGS: 'Components/Overlays/Dialogs',
      POPOVERS: 'Components/Overlays/Popovers',
      TOOLTIPS: 'Components/Overlays/Tooltips',
    },
  },

  // Features - Domain-specific components
  FEATURES: {
    UPLOAD: {
      ROOT: 'Features/Upload',
      COMPONENTS: 'Features/Upload/Components',
      FORMS: 'Features/Upload/Forms',
    },
    TRANSCRIPTION: {
      ROOT: 'Features/TranscriptionJob',
      TABLE: 'Features/TranscriptionJob/Table',
      VIEWER: 'Features/TranscriptionJob/Viewer',
    },
    DASHBOARD: {
      ROOT: 'Features/Dashboard',
      WIDGETS: 'Features/Dashboard/Widgets',
    },
    AUTH: {
      ROOT: 'Features/Authentication',
      COMPONENTS: 'Features/Authentication/Components',
    },
    UPGRADE: {
      ROOT: 'Features/Upgrade',
      COMPONENTS: 'Features/Upgrade/Components',
    },
  },

  // Pages - Full page examples
  PAGES: {
    ROOT: 'Pages',
    DASHBOARD: 'Pages/Dashboard',
    TRANSCRIPTIONS: 'Pages/Transcriptions',
    SETTINGS: 'Pages/Settings',
  },

  // Patterns - Common UI patterns
  PATTERNS: {
    ROOT: 'Patterns',
    FORMS: 'Patterns/Forms',
    EMPTY_STATES: 'Patterns/Empty States',
    ERROR_STATES: 'Patterns/Error States',
    LOADING_STATES: 'Patterns/Loading States',
  },
} as const;

// Type helper to get all story paths as a union type
export type StoryPath = (typeof STORY_PATHS)[keyof typeof STORY_PATHS] extends infer T
  ? T extends Record<string, any>
    ? T[keyof T] extends string
      ? T[keyof T]
      : T[keyof T] extends Record<string, any>
        ? T[keyof T][keyof T[keyof T]]
        : never
    : never
  : never;
