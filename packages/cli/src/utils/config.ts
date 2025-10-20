import 'dotenv/config';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * API base URL
 * Production: https://conduit8.com/api/v1
 * Override: CONDUIT8_API_URL=http://localhost:8787/api/v1
 * .env file supported for local dev
 */
export const API_BASE_URL = process.env.CONDUIT8_API_URL ?? 'https://conduit8.com/api/v1';

/**
 * Personal skills directory (user-level, cross-project)
 * Mac/Linux: ~/.claude/skills
 * Windows: %USERPROFILE%\.claude\skills
 */
export const PERSONAL_SKILLS_DIR = join(homedir(), '.claude', 'skills');

/**
 * Project skills directory (team-shared via git)
 * Relative to current working directory
 */
export const PROJECT_SKILLS_DIR = join(process.cwd(), '.claude', 'skills');

/**
 * Default installation location (personal)
 */
export const DEFAULT_SKILLS_DIR = PERSONAL_SKILLS_DIR;
