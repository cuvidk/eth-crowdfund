import web3 from "./web3";
import campaignFactory from "../ethereum/build/CampaignFactory.json";

export default new web3.eth.Contract(
  campaignFactory.abi,
  // This line cannot be used in client code
  // because process.env is not available there
  //process.env.CONTRACT_ADDR
  "0x6efda9920dca1b02e704b5671f992a9b2a5e2886"
);
