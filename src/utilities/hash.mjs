import crypto from 'crypto';

export const createHash = (...args) => {
  const hash = crypto.createHash('sha256');
  hash.update(args.join(' '));
  return hash.digest('hex');
};

// Deterministisk serialisering av objekt
export function stableStringify(obj) {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(obj).sort().map(key => JSON.stringify(key) + ':' + stableStringify(obj[key])).join(',') + '}';
}