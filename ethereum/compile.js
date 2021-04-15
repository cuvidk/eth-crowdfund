const fs = require("fs");
const path = require("path");
const solc = require("solc");

const srcs = ["CrowdfundCampaign.sol", "CampaignFactory.sol"];
const SOURCE_DIR_NAME = "contracts";
const BUILD_DIR_NAME = "build";

const contractsPath = path.resolve(__dirname, SOURCE_DIR_NAME);
const buildPath = path.resolve(__dirname, BUILD_DIR_NAME);

const srcsPaths = srcs.map((src) => {
  return path.resolve(contractsPath, src);
});

let sources = {};
srcsPaths.forEach((srcPath) => {
  const content = fs.readFileSync(srcPath, { encoding: "utf8" });
  sources[srcPath] = { content: content };
});

const input = {
  language: "Solidity",
  sources: sources,
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

fs.rmdirSync(buildPath, { recursive: true });
fs.mkdirSync(buildPath, { recursive: true });

const output = JSON.parse(solc.compile(JSON.stringify(input)));

for (let contractPath in output.contracts) {
  for (let contract in output.contracts[contractPath]) {
    fs.writeFileSync(
      path.resolve(buildPath, contract + ".json"),
      JSON.stringify(output.contracts[contractPath][contract]),
      { encoding: "utf8", flag: "w" }
    );
  }
}
