import Web3 from "web3";

let web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.BCHAIN_CONN_PROVIDER)
  );
}

export default web3;
