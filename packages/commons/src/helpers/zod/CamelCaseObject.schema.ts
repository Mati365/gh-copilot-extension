import { z } from 'zod';
import camelcaseKeys from 'camelcase-keys';

export const CamelCaseObjectV = z
  .record(z.any())
  .transform(object => camelcaseKeys(object, { deep: true }));
