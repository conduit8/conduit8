import { displayInstalledSkills } from '../utils/display';
import { listInstalledSkills } from '../utils/fs';

export async function list(): Promise<void> {
  try {
    const skills = await listInstalledSkills();
    displayInstalledSkills(skills);
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('Error listing skills:', error.message);
    }
    else {
      console.error('Failed to list skills');
    }
    process.exit(1);
  }
}
