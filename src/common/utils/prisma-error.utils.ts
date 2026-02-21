import {
  PRISMA_ERROR_MESSAGES,
  UNIQUE_FIELD_MESSAGES,
} from '../constants/prisma-error-messages';

const FIELD_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export const extractPrismaTargetFields = (target: unknown): string[] => {
  if (Array.isArray(target)) {
    return target
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
      .filter((value) => FIELD_NAME_PATTERN.test(value));
  }

  if (typeof target === 'string') {
    const normalized = target.trim();
    if (FIELD_NAME_PATTERN.test(normalized)) return [normalized];
  }

  return [];
};

const extractFieldsFromRawMessage = (rawMessage?: string): string[] => {
  if (typeof rawMessage !== 'string') return [];

  const fieldsSection = rawMessage.match(/fields?:\s*\(([^)]+)\)/i);
  if (!fieldsSection?.[1]) return [];

  return [...fieldsSection[1].matchAll(/`([^`]+)`/g)]
    .map((match) => match[1].trim())
    .filter((value) => FIELD_NAME_PATTERN.test(value));
};

export const getUniqueConstraintMessage = (
  target: unknown,
  rawMessage?: string,
): string => {
  const fields = [
    ...extractPrismaTargetFields(target),
    ...extractFieldsFromRawMessage(rawMessage),
  ];
  const uniqueFields = [...new Set(fields)];
  if (uniqueFields.length === 0) return PRISMA_ERROR_MESSAGES.UNIQUE_DEFAULT;

  const mappedMessage = UNIQUE_FIELD_MESSAGES[uniqueFields[0].toLowerCase()];
  if (mappedMessage) return mappedMessage;

  return `Unique constraint failed on field(s): ${uniqueFields.join(', ')}`;
};
