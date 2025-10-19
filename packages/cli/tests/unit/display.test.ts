import { describe, expect, it } from 'vitest';

import { formatSize } from '../../src/utils/display.js';

describe('formatSize', () => {
  it('formats bytes correctly', () => {
    expect(formatSize(0)).toBe('0B');
    expect(formatSize(100)).toBe('100B');
    expect(formatSize(999)).toBe('999B');
    expect(formatSize(1023)).toBe('1023B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatSize(1024)).toBe('1.0KB');
    expect(formatSize(1536)).toBe('1.5KB');
    expect(formatSize(10240)).toBe('10.0KB');
    expect(formatSize(102400)).toBe('100.0KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatSize(1048576)).toBe('1.0MB');
    expect(formatSize(1572864)).toBe('1.5MB');
    expect(formatSize(10485760)).toBe('10.0MB');
    expect(formatSize(2457600)).toBe('2.3MB');
  });

  it('handles edge cases', () => {
    expect(formatSize(1024 * 1024 - 1)).toBe('1024.0KB');
    expect(formatSize(1024 * 1024)).toBe('1.0MB');
    expect(formatSize(1024 * 1024 * 10.5)).toBe('10.5MB');
  });
});
