import { createHash, stableStringify } from '../utilities/hash.mjs';
import Block from './Block.mjs';
import fs from 'fs';
import path from 'path';

export default class Blockchain {
  constructor(file = 'blockchain.json') {
    this.blockchainFile = path.resolve(file);
    this.chain = [Block.genesis()];
    try {
      const data = fs.readFileSync(this.blockchainFile, 'utf8');
      const loadedChain = JSON.parse(data);
      if (Blockchain.isValid(loadedChain)) {
        this.chain = loadedChain;
      }
    } catch (error) {
    }
  }

  async saveChain() {
    console.log(`Saving chain with ${this.chain.length} blocks to ${this.blockchainFile}`);
    await fs.promises.writeFile(this.blockchainFile, JSON.stringify(this.chain, null, 2));
  }

 async addBlock({ data }) {
  const newBlock = Block.mineBlock({
    previousBlock: this.chain[this.chain.length - 1],
    data
  });
  console.log('addBlock: New block before push:', newBlock);
  this.chain.push(newBlock);
  console.log('addBlock: Chain after push:', this.chain);
  await this.saveChain();
  console.log('addBlock: Saved chain to file:', this.blockchainFile);
}

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      return;
    }

    if (!Blockchain.isValid(chain)) {
      return;
    }

    this.chain = chain;
  }

  static isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, data, hash, nonce, difficulty } = chain[i];
      const actualLastHash = chain[i - 1].hash;
      if (lastHash !== actualLastHash) {
        return false;
      }
      const expectedHash = createHash(timestamp, lastHash, stableStringify(data), nonce, difficulty);
      if (hash !== expectedHash) {
        return false;
      }
    }
    return true;
  }
}