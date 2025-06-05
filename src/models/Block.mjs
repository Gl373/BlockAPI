import { MINE_RATE, INITIAL_DIFFICULTY } from '../utilities/constants.mjs';
import { createHash, stableStringify } from '../utilities/hash.mjs';
import { genesisBlock } from './genesis.mjs';

export default class Block {
  constructor({ timestamp, lastHash, data, hash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new Block(genesisBlock);
  }

  static mineBlock({ previousBlock, data }) {
    let timestamp, hash, nonce = 0;
    const lastHash = previousBlock.hash;
    let { difficulty } = previousBlock;

    do {
      nonce++;
      timestamp = Date.now();
      hash = createHash(timestamp, lastHash, stableStringify(data), nonce, difficulty);
      difficulty = Block.adjustDifficultyLevel({ block: previousBlock, timestamp });
    } while (!hash.startsWith('0'.repeat(difficulty)));

    return new Block({ timestamp, lastHash, data, hash, nonce, difficulty });
  }

  static adjustDifficultyLevel({ block, timestamp }) {
    let { difficulty } = block;
    if (timestamp - block.timestamp > MINE_RATE) {
      difficulty = difficulty - 1;
    } else {
      difficulty = difficulty + 1;
    }
    return Math.max(difficulty, 1);
  }
}