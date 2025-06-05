import { describe, it, expect } from 'vitest';
import Block from '../models/Block.mjs';
import { createHash } from '../utilities/hash.mjs';

describe('Block', () => {
  const timestamp = Date.now();
  const lastHash = 'last-hash';
  const data = { transactionId: 'tx123', amount: 100 };
  const hash = createHash(timestamp, lastHash, JSON.stringify(data));
  const block = new Block({ timestamp, lastHash, data, hash });

  it('sets properties correctly', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
  });
});