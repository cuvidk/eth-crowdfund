const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const campaignFactory = require("../ethereum/build/CampaignFactory.json");
const crowdfundCampaign = require("../ethereum/build/CrowdfundCampaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

const failReason = (err) => err.results[err.hashes[0]].reason;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(campaignFactory.abi)
    .deploy({ data: "0x" + campaignFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1500000" });
  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1500000" });
  campaignAddress = (await factory.methods.getCampaigns().call())[0];
  campaign = new web3.eth.Contract(crowdfundCampaign.abi, campaignAddress);
});

describe("CrowdfundCampaign", () => {
  it("deploys campaign factory and crowdfund campaign", async () => {
    assert(factory.options.address);
    assert(campaign.options.address);
  });

  it("accepts contributions", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });
    const contributed = await campaign.methods.contributors(accounts[1]).call();
    assert.strictEqual(contributed, true);
  });

  it("rejects contribution on contribution value to low", async () => {
    const result = await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "50" })
      .catch((err) => {
        assert.strictEqual(failReason(err), "Contribution amount too low");
      });
    assert.strictEqual(result, undefined);
  });

  it("rejects contribution if already contributed", async () => {
    let result = await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" })
      .catch((err) => {
        assert(err);
      });
    assert(result);
    result = await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" })
      .catch((err) => {
        assert.strictEqual(failReason(err), "You already funded this campaign");
      });
    assert.strictEqual(result, undefined);
  });

  it("allows request creation", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[2])
      .send({ from: accounts[0], gas: "1500000" });
    const spendingRequest = await campaign.methods.requests(0).call();
    assert.strictEqual(spendingRequest.description, "Buy stuff");
    assert.strictEqual(spendingRequest.value, "1000000");
  });

  it("rejects request creation if not the owner of the campaign", async () => {
    const result = await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[2])
      .send({ from: accounts[5], gas: "1500000" })
      .catch((err) => {
        assert.strictEqual(
          failReason(err),
          "Operation reserved for owner only"
        );
      });

    assert.strictEqual(result, undefined);
  });

  it("allows approving a request", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[2])
      .send({ from: accounts[0], gas: "1500000" });

    await campaign.methods
      .contribute()
      .send({ from: accounts[4], value: "200" });

    let request = await campaign.methods.requests(0).call();
    assert.strictEqual(request.approvalsCount, "0");

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[4], gas: "1500000" });

    request = await campaign.methods.requests(0).call();
    assert.strictEqual(request.approvalsCount, "1");
  });

  it("rejects approving a request if not a contributor", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[2])
      .send({ from: accounts[0], gas: "1500000" });

    const result = await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[4], gas: "1500000" })
      .catch((err) => {
        assert.strictEqual(
          failReason(err),
          "You need to contribute to the campaign before you can vote"
        );
      });

    assert.strictEqual(result, undefined);
  });

  it("rejects approving a request multiple times by the same account", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[2])
      .send({ from: accounts[0], gas: "1500000" });

    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1500000" });

    const result = await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1500000" })
      .catch((err) => {
        assert.strictEqual(
          failReason(err),
          "You already approved this request"
        );
      });

    assert.strictEqual(result, undefined);
  });

  it("accepts finalizing a request", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[1])
      .send({ from: accounts[0], gas: "1500000" });

    await campaign.methods
      .contribute()
      .send({ from: accounts[4], value: "2000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[4], gas: "1500000" });

    let request = await campaign.methods.requests(0).call();
    assert.strictEqual(request.completed, false);

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1500000" });

    request = await campaign.methods.requests(0).call();
    assert.strictEqual(request.completed, true);
  });

  it("rejects finalizing a request if not the owner", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[1])
      .send({ from: accounts[0], gas: "1500000" });

    await campaign.methods
      .contribute()
      .send({ from: accounts[4], value: "2000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[4], gas: "1500000" });

    const result = await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[9], gas: "1500000" })
      .catch((err) => {
        assert.strictEqual(
          failReason(err),
          "Operation reserved for owner only"
        );
      });

    assert.strictEqual(result, undefined);
  });

  it("rejects finalizing a request if not enough approvals", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[1])
      .send({ from: accounts[0], gas: "1500000" });

    await campaign.methods
      .contribute()
      .send({ from: accounts[4], value: "2000000" });

    const result = await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1500000" })
      .catch((err) => {
        assert.strictEqual(failReason(err), "Not enough approvals");
      });

    assert.strictEqual(result, undefined);
  });

  it("rejects finalizing a request if not enough funds to transfer", async () => {
    await campaign.methods
      .createRequest("Buy stuff", "1000000", accounts[1])
      .send({ from: accounts[0], gas: "1500000" });

    await campaign.methods
      .contribute()
      .send({ from: accounts[4], value: "2000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[4], gas: "1500000" });

    const result = await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1500000" })
      .catch((err) => {
        assert.strictEqual(
          failReason(err),
          "Balance to low to finalize the transaction"
        );
      });

    assert.strictEqual(result, undefined);
  });
});
