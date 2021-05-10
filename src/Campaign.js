import web3 from "./web3";
import campaign from "../ethereum/build/CrowdfundCampaign.json";

export default function campaignWithAddress(address) {
  return new web3.eth.Contract(campaign.abi, address);
}
