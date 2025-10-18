import { z } from 'zod';

export const TimestamptzSchema = z.preprocess(
  val => (val ? new Date(val as string | Date).toISOString() : val),
  z.iso.datetime(),
);
export type Timestamptz = z.infer<typeof TimestamptzSchema>;
