import type { Skill } from '@conduit8/core';

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SkillsFilterOptions } from '@web/pages/public/home/hooks/use-skills-filter';

import { useSkillsFilter } from '@web/pages/public/home/hooks/use-skills-filter';

describe('useSkillsFilter', () => {
  const mockSkills: Skill[] = [
    {
      id: '1',
      slug: 'skill-a',
      name: 'Alpha Skill',
      description: 'First skill',
      category: 'development',
      authorKind: 'verified',
      downloadCount: 100,
      author: 'Test',
      sourceType: 'import',
      sourceUrl: 'https://example.com',
      zipKey: 'skills/skill-a.zip',
      imageKey: 'images/skill-a.png',
      examples: ['Example 1'],
      curatorNote: null,
    },
    {
      id: '2',
      slug: 'skill-b',
      name: 'Beta Skill',
      description: 'Second skill',
      category: 'design',
      authorKind: 'community',
      downloadCount: 200,
      author: 'Test',
      sourceType: 'pr',
      sourceUrl: 'https://example.com',
      zipKey: 'skills/skill-b.zip',
      imageKey: 'images/skill-b.png',
      examples: ['Example 1'],
      curatorNote: null,
    },
    {
      id: '3',
      slug: 'skill-c',
      name: 'Gamma Skill',
      description: 'Third skill',
      category: 'development',
      authorKind: 'verified',
      downloadCount: 50,
      author: 'Test',
      sourceType: 'import',
      sourceUrl: 'https://example.com',
      zipKey: 'skills/skill-c.zip',
      imageKey: 'images/skill-c.png',
      examples: ['Example 1'],
      curatorNote: null,
    },
  ];

  it('returns empty array when skills is undefined', () => {
    const options: SkillsFilterOptions = { categories: [], sources: [], sortBy: 'downloads' };
    const { result } = renderHook(() => useSkillsFilter(undefined, options));

    expect(result.current).toEqual([]);
  });

  it('returns all skills when no filters applied', () => {
    const options: SkillsFilterOptions = { categories: [], sources: [], sortBy: 'downloads' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current).toHaveLength(3);
  });

  it('filters by category', () => {
    const options: SkillsFilterOptions = { categories: ['development'], sources: [], sortBy: 'downloads' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current).toHaveLength(2);
    expect(result.current.every(s => s.category === 'development')).toBe(true);
  });

  it('filters by source', () => {
    const options: SkillsFilterOptions = { categories: [], sources: ['verified'], sortBy: 'downloads' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current).toHaveLength(2);
    expect(result.current.every(s => s.authorKind === 'verified')).toBe(true);
  });

  it('sorts by downloads descending', () => {
    const options: SkillsFilterOptions = { categories: [], sources: [], sortBy: 'downloads' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current[0].downloadCount).toBe(200);
    expect(result.current[1].downloadCount).toBe(100);
    expect(result.current[2].downloadCount).toBe(50);
  });

  it('sorts alphabetically A-Z', () => {
    const options: SkillsFilterOptions = { categories: [], sources: [], sortBy: 'az' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current[0].name).toBe('Alpha Skill');
    expect(result.current[1].name).toBe('Beta Skill');
    expect(result.current[2].name).toBe('Gamma Skill');
  });

  it('sorts alphabetically Z-A', () => {
    const options: SkillsFilterOptions = { categories: [], sources: [], sortBy: 'za' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current[0].name).toBe('Gamma Skill');
    expect(result.current[1].name).toBe('Beta Skill');
    expect(result.current[2].name).toBe('Alpha Skill');
  });

  it('combines category filter and sort', () => {
    const options: SkillsFilterOptions = { categories: ['development'], sources: [], sortBy: 'az' };
    const { result } = renderHook(() => useSkillsFilter(mockSkills, options));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].name).toBe('Alpha Skill');
    expect(result.current[1].name).toBe('Gamma Skill');
  });
});
