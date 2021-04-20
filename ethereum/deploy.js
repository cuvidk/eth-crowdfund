require("dotenv").config();
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");
const fs = require("fs");
const compiledContract = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider({
  mnemonic: process.env.WALLET_MNEMONIC,
  providerOrUrl: process.env.BCHAIN_CONN_PROVIDER,
});
const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];
  const result = await new web3.eth.Contract(compiledContract.abi)
    .deploy({
      data: "0x" + compiledContract.evm.bytecode.object,
    })
    .send({
      from: sender,
      gas: "1500000",
    })
    .on("sending", () => {
      console.log("Deploying contract...");
    })
    .catch((err) => {
      console.log(err);
      provider.engine.stop();
    });

  if (!result) return;

  const outContent = "\nCONTRACT_ADDR = " + result.options.address;
  const outPath = path.resolve(__dirname, "..", ".env");

  fs.writeFileSync(outPath, outContent, { encoding: "utf8", flag: "a" });
  console.log(`Wrote contract data to ${outPath}`);

  provider.engine.stop();
})();
