import { useCallback, useReducer } from 'react';

import type { CategoryValue, SortValue, SourceValue } from '../constants/filter-options';

/**
 * Browse state represents the complete context of how users browse skills
 * Combines search query, filters, and sort preferences
 */
export interface SkillsBrowseState {
  searchQuery: string;
  selectedCategories: CategoryValue[];
  sortBy: SortValue;
  selectedSources: SourceValue[];
}

/**
 * Actions that can modify browse state
 * Using discriminated union for type safety
 */
type SkillsBrowseAction
  = | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SET_CATEGORIES'; payload: CategoryValue[] }
    | { type: 'SET_SORT'; payload: SortValue }
    | { type: 'SET_SOURCES'; payload: SourceValue[] }
    | { type: 'RESET_FILTERS' };

const initialState: SkillsBrowseState = {
  searchQuery: '',
  selectedCategories: [],
  sortBy: 'downloads',
  selectedSources: [],
};

/**
 * Reducer handles all browse state transitions
 * Centralized logic makes state changes predictable and testable
 */
function browseReducer(state: SkillsBrowseState, action: SkillsBrowseAction): SkillsBrowseState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, selectedCategories: action.payload };

    case 'SET_SORT':
      return { ...state, sortBy: action.payload };

    case 'SET_SOURCES':
      return { ...state, selectedSources: action.payload };

    case 'RESET_FILTERS':
      return {
        ...state,
        selectedCategories: [],
        selectedSources: [],
        sortBy: 'downloads',
      };

    default: {
      // TypeScript exhaustiveness check - ensures all action types are handled
      const _exhaustive: never = action;
      console.error('Unknown action type:', _exhaustive);
      return state;
    }
  }
}

/**
 * Custom hook encapsulating all browse state management
 *
 * Performance optimizations:
 * - useCallback: Stable setter functions prevent unnecessary re-renders
 * - useReducer: Centralized state updates, easier to optimize than multiple useState
 *
 * @returns Browse state and stable setters
 */
export function useSkillsBrowse() {
  const [state, dispatch] = useReducer(browseReducer, initialState);

  // Stable callbacks - useCallback ensures these don't change identity between renders
  // Prevents unnecessary re-renders in child components that depend on these
  const setSearchQuery = useCallback(
    (query: string) => dispatch({ type: 'SET_SEARCH', payload: query }),
    [],
  );

  const setCategories = useCallback(
    (categories: CategoryValue[]) => dispatch({ type: 'SET_CATEGORIES', payload: categories }),
    [],
  );

  const setSortBy = useCallback(
    (sort: SortValue) => dispatch({ type: 'SET_SORT', payload: sort }),
    [],
  );

  const setSources = useCallback(
    (sources: SourceValue[]) => dispatch({ type: 'SET_SOURCES', payload: sources }),
    [],
  );

  const resetFilters = useCallback(
    () => dispatch({ type: 'RESET_FILTERS' }),
    [],
  );

  // Computed: Check if any filters are active (search query or filter selections)
  // Note: sortBy is not a filter - it reorders but doesn't exclude results
  const hasActiveFilters
    = state.searchQuery.trim() !== ''
    || state.selectedCategories.length > 0
    || state.selectedSources.length > 0;

  return {
    // Current state
    searchQuery: state.searchQuery,
    selectedCategories: state.selectedCategories,
    sortBy: state.sortBy,
    selectedSources: state.selectedSources,
    hasActiveFilters,

    // Stable setters
    setSearchQuery,
    setCategories,
    setSortBy,
    setSources,
    resetFilters,
  };
}
