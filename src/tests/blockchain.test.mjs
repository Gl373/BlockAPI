import { describe, it, expect, beforeEach } from 'vitest';
import Blockchain from '../models/Blockchain.mjs';
import Block from '../models/Block.mjs';
import Transaction from '../models/Transaction.mjs';
import fs from 'fs/promises';
import path from 'path';

const blockchainFile = path.resolve('blockchain.test.json');

describe('Blockchain', () => {
  let blockchain;

  beforeEach(async () => {
    await fs.writeFile(blockchainFile, JSON.stringify([Block.genesis()], null, 2));
    blockchain = new Blockchain('blockchain.test.json');
  });

  it('should add a block with transaction data', () => {
    const transaction = new Transaction({
      id: 'tx789',
      amount: 300,
      sender: 'Alice',
      receiver: 'Bob'
    });
    blockchain.addBlock({ data: transaction });
    expect(blockchain.chain.at(-1).data).toEqual(transaction);
  });
});