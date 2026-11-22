import { randomBytes, randomUUID } from 'crypto';

/**
 * Generates an un-guessable, high-entropy hardware tracking code.
 * Example format: DLC-7F3A-8C21 (65,536 x 65,536 = 4.29 billion combinations)
 * Cannot be enumerated or brute-forced.
 */
export function generateDeviceTrackingCode(): string {
  const buf = randomBytes(4);
  const part1 = buf.subarray(0, 2).toString('hex').toUpperCase();
  const part2 = buf.subarray(2, 4).toString('hex').toUpperCase();
  return `DLC-${part1}-${part2}`;
}

/**
 * Generates a collision-resistant donation intent / receipt identifier.
 * Example format: DLC-REC-20260905-A1B2C3
 */
export function generateDonationReceiptNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const entropy = randomBytes(3).toString('hex').toUpperCase();
  return `DLC-REC-${dateStr}-${entropy}`;
}

/**
 * Generates a collision-resistant unique slug suffix for projects or organizations.
 */
export function generateSecureSlugSuffix(): string {
  return randomBytes(3).toString('hex');
}

/**
 * Generates a secure random token (e.g. for session identifiers or webhook secrets).
 */
export function generateSecureToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Returns a standard UUID v4.
 */
export function generateUUID(): string {
  return randomUUID();
}
