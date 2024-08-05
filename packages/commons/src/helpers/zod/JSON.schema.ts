import { z } from 'zod';

export const JsonV = z.string().transform(x => JSON.parse(x));
