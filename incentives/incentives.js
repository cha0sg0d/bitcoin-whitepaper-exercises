"use strict";

var path = require("path");
var fs = require("fs");
var crypto = require("crypto");

const KEYS_DIR = path.join(__dirname,"keys");
const PUB_KEY_TEXT = fs.readFileSync(path.join(KEYS_DIR,"pub.pgp.key"),"utf8");

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

const maxBlockSize = 4;
const blockFee = 5;
var difficulty = 16;

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

var transactionPool = [];

addPoem();
processPool();
countMyEarnings();


// **********************************

function addPoem() {
	// TODO: add lines of poem as transactions to the transaction-pool
  for (let line of poem) {
    transactionPool.push(createTransaction(line));
  }
}

function processPool() {
	// TODO: process the transaction-pool in order of highest fees
  transactionPool.sort((txA, txB) => {
    return txB.fee - txA.fee;
  });
  
  // console.log(`txPoolSort`, transactionPool)
  
  let i = 0;

  while(i < transactionPool.length) {
    let data = [];
    data.push({blockFee: blockFee, account: PUB_KEY_TEXT });
    while (data.length <= maxBlockSize && i < transactionPool.length) {
      data.push(transactionPool[i]);
      i++;
    }
    Blockchain.blocks.push(createBlock(data));
  }  
}

function countMyEarnings() {
	// TODO: count up block-fees and transaction-fees

  // console.dir(Blockchain)
  let earnings = 0;
  Blockchain.blocks.forEach((block, index) => {
    // console.log(block)
    if (index !== 0) {
      // console.log(`blockfee`, block.data[0].blockFee)
      earnings += block.data[0].blockFee;
      for (const [i, tx] of block.data.entries())  {
        if (i !== 0) {
          earnings += tx.fee;
        }
      }
    }
  });

  console.log(`my total earnings: ${earnings}`);
}

function createBlock(data) {
	var bl = {
		index: Blockchain.blocks.length,
		prevHash: Blockchain.blocks[Blockchain.blocks.length-1].hash,
		data,
		timestamp: Date.now(),
	};

	bl.hash = blockHash(bl);

	return bl;
}

function blockHash(bl) {
	while (true) {
		bl.nonce = Math.trunc(Math.random() * 1E7);
		let hash = crypto.createHash("sha256").update(
			`${bl.index};${bl.prevHash};${JSON.stringify(bl.data)};${bl.timestamp};${bl.nonce}`
		).digest("hex");

		if (hashIsLowEnough(hash)) {
			return hash;
		}
	}
}

function hashIsLowEnough(hash) {
	var neededChars = Math.ceil(difficulty / 4);
	var threshold = Number(`0b${"".padStart(neededChars * 4,"1111".padStart(4 + difficulty,"0"))}`);
	var prefix = Number(`0x${hash.substr(0,neededChars)}`);
	return prefix <= threshold;
}

function createTransaction(data) {
	var tr = {
		data,
	};

	tr.hash = transactionHash(tr);
  tr.fee = Math.floor((Math.random() * 10) + 1);

	return tr;
}

function transactionHash(tr) {
	return crypto.createHash("sha256").update(
		`${JSON.stringify(tr.data)}`
	).digest("hex");
}
