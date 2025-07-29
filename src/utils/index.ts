// Export all utility functions and helpers
export * from './logger';

// Common utility functions for the application
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

export function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return '[Circular or Invalid JSON]';
  }
}

export function extractUniqueUsers(messages: Array<{ sender: string }>): string[] {
  return Array.from(new Set(messages.map(msg => msg.sender)));
}

export function calculateConfidenceScore(factors: {
  messageCount: number;
  averageLength: number;
  userParticipation: number;
}): number {
  // Simple confidence calculation based on thread quality factors
  const messageScore = Math.min(factors.messageCount / 10, 1); // Max score at 10+ messages
  const lengthScore = Math.min(factors.averageLength / 100, 1); // Max score at 100+ chars avg
  const participationScore = Math.min(factors.userParticipation / 3, 1); // Max score at 3+ users
  
  return Math.round((messageScore + lengthScore + participationScore) / 3 * 100) / 100;
}

export function sanitizeText(text: string): string {
  // Remove potentially harmful characters while preserving readability
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .trim();
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}