"use strict";

var path = require("path");
var fs = require("fs");
var openpgp = require("openpgp");

const KEYS_DIR = path.join(__dirname,"keys");

var options = {
	userIDs: [{ name: "Bitcoin Whitepaper", email: "bitcoin@whitepaper.tld" }],
	rsaBits: 2048,
	passphrase: "",
};

openpgp.generateKey(options).then(function onGenerated(key) {
	try { fs.mkdirSync(KEYS_DIR); } catch (err) {}
  console.log(`keys`, key);
	fs.writeFileSync(path.join(KEYS_DIR,"priv.pgp.key"),key.privateKey,"utf8");
	fs.writeFileSync(path.join(KEYS_DIR,"pub.pgp.key"),key.publicKey,"utf8");

	console.log("Keypair generated.");
});
