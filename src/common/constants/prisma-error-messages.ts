export const PRISMA_ERROR_MESSAGES = {
  P2003: 'Foreign key constraint failed',
  P2014: 'Relation constraint failed',
  P2025: 'Record not found',
  DEFAULT: 'Database request failed',
  UNIQUE_DEFAULT: 'Unique constraint failed',
} as const;

export const UNIQUE_FIELD_MESSAGES: Record<string, string> = {
  email: 'Email already exists',
};
