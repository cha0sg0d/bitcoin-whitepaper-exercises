"use strict";

var crypto = require("crypto");
const { connect } = require("http2");

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

var difficulty = 10;

const BITS_IN_HEX = 4;
const HEX_BASE = 16;

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

for (let line of poem) {
	let bl = createBlock(line);
	Blockchain.blocks.push(bl);
	console.log(`Hash (Difficulty: ${difficulty}): ${bl.hash} for ${bl.nonce} reps`);

	difficulty++;
}

// console.dir(Blockchain.blocks);

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);

// **********************************

function createBlock(data) {
	var bl = {
		index: Blockchain.blocks.length,
		prevHash: Blockchain.blocks[Blockchain.blocks.length-1].hash,
		data,
		timestamp: Date.now(),
	};
  
  bl.nonce = 0;

  bl.hash = blockHash(bl)
  while (!hashIsLowEnough(bl.hash)) {
    bl.nonce = bl.nonce + 1;
    bl.hash = blockHash(bl);
  }
	return bl;
}

// copy from ../hashing
function blockHash(bl) {
  let clone = {...bl}
  delete clone.hash; // remove hash property. the hash itself is not needed
	let hash = crypto.createHash("sha256")
    .update(JSON.stringify(clone))
    .digest("hex"); 
  // console.log(`new hash`, hash)
  return hash;
}

function hashIsLowEnough(hash) {
  // console.log(`hash is ${hash}`);
  const numHexChars = Math.floor(difficulty / BITS_IN_HEX) + 1;
  const firstXChars = hash.slice(0, numHexChars);
  // console.log(`first ${numHexChars} hex chars of hash ${firstXChars}`);
  // number representing target w corret number of zeros
  const binaryTarget = "0b" + ("1".padStart(difficulty, "0"))
  // console.log(`binary target ${binaryTarget}`);
  const numTarget = Number(binaryTarget);
  // number representing first x hex chars of hash, converted to number.
  const hashNum = parseInt(firstXChars, HEX_BASE)
  // console.log(`hashNum is ${hashNum} with ${numHexChars} chars`);
  // console.log(`is hashnum ${hashNum} < target ${numTarget}? ${hashNum < numTarget}`)
  return hashNum < numTarget;
}


function verifyBlock(bl) {
	if (bl.data == null) return false;
	if (bl.index === 0) {
		if (bl.hash !== "000000") return false;
	}
	else {
		if (!bl.prevHash) return false;
		if (!(
			typeof bl.index === "number" &&
			Number.isInteger(bl.index) &&
			bl.index > 0
		)) {
			return false;
		}
		if (bl.hash !== blockHash(bl)) {
      return false
    };
	}

	return true;
}

function verifyChain(chain) {
	var prevHash;
	for (let bl of chain.blocks) {
		if (prevHash && bl.prevHash !== prevHash) return false;

		if (!verifyBlock(bl)) return false;

	  prevHash = bl.hash;
	}

	return true;
}
