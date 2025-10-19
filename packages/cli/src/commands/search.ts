import ora from 'ora';

import { searchSkills } from '../utils/api.js';
import { displaySearchResults } from '../utils/display.js';

export async function search(query?: string): Promise<void> {
  try {
    const spinner = ora('Searching...').start();
    const skills = await searchSkills(query);
    spinner.stop();

    displaySearchResults(skills, query);
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('Error searching skills:', error.message);
    }
    else {
      console.error('Failed to search skills');
    }
    process.exit(1);
  }
}
