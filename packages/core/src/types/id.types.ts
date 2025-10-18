import { z } from 'zod';

const _uuidv4Schema = z.uuidv4();
export type UUIDv4 = z.infer<typeof _uuidv4Schema>;
