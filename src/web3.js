import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

let provider;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  provider = window.ethereum;
} else {
  provider = new Web3.providers.HttpProvider(process.env.BCHAIN_CONN_PROVIDER);
}

export default new Web3(provider);
