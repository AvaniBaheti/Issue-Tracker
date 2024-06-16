import { z } from 'zod';

export const issueSchema = z.object({
  title: z.string().max(200, 'Title must be 200 characters or less'),
  description: z.string().max(5000, 'Description must be 5000 characters or less'),
});
