"use strict";

var crypto = require("crypto");

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

// used for demonstrating that the hashes change when one character changes
var poem1 = [
	"The power of a gun can kilt",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

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

// Define a createBlock(..) function which takes the text for its data, 
// creates an object for the block, and computes its hash, 
// finally returning the block object. 
// Insert this object into the blocks array for the blockchain.
function createBlock(text) {
  let block = {};
  const currBlock = Blockchain.blocks.length;
  const prevBlock = currBlock - 1;
  block.index = currBlock;
  block.prevHash = Blockchain.blocks[prevBlock].hash
  block.data = text;
  block.timestamp = Date.now();
  block.hash = blockHash([block.index, block.prevHash, block.data, block.timestamp]);
  return block;
}

// TODO: insert each line into blockchain
for (let line of poem) {
  Blockchain.blocks.push(createBlock(line));
}

function verifyBlock(block, index, blockchain) {
  let conditions = [];

  // genesis is correct
  if (index == 0) {
    conditions.push(block.hash == "000000");
  }
  else {
    // data is not empty
    conditions.push(block.data != "");

    // prevHash is not empty
    conditions.push(block.prevHash != "");

    // index is int >= 0
    conditions.push(block.index >= 0);

    // hash matches block.hash
    conditions.push(block.hash == blockHash([block.index, block.prevHash, block.data, block.timestamp]));

    // prevHash of curr block == hash of prev block
    conditions.push(block.prevHash == blockchain[index - 1].hash);
  }

  return conditions.every((v) => v);

}

function verifyChain(blocks) {
  return Blockchain.blocks.every(verifyBlock)
}

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// **********************************

function blockHash(bl) {
	const hash = crypto.createHash("sha256")
    .update(bl.toString())
    .digest("hex");
  // console.log(hash);
  return hash;
}
