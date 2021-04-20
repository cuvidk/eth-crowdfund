import web3 from "./web3";
import campaignFactory from "../ethereum/build/CampaignFactory.json";

export default new web3.eth.Contract(
  campaignFactory.abi,
  "0x9185B022DA54c1391E589e7C7398632Fe9fb1Db8"
);
