import React from "react";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import campaignWithAddress from "../../../Campaign";

const Campaign = (props) => {
  const router = useRouter();
  const campaignAddr = router.query.campaignAddr;

  return (
    <Layout>
      <h1>Campaign: {router.query.campaignAddr}</h1>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const campaign = campaignWithAddress(context.params.campaignAddr);
  const summary = await campaign.methods
    .getSummary()
    .call()
    .catch((err) => {
      console.log(err);
    });

  return {
    props: {
      summary: JSON.parse(JSON.stringify(summary)),
    },
  };
}

export default Campaign;
