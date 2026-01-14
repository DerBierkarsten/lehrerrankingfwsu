import crypto from 'crypto';

/**
 * Hash an IP address to prevent duplicate voting while maintaining privacy
 */
export function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.NEXT_PUBLIC_HASH_SECRET || 'default-secret')
    .digest('hex');
}
