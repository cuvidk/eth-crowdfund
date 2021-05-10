import React from "react";
import { Button, Container, Card } from "semantic-ui-react";
import Link from "next/link";

import factory from "../CampaignFactory";
import "../components/Layout";
import Layout from "../components/Layout";

const Index = ({ campaigns }) => {
  const items = campaigns.map((campaign) => {
    return {
      header: campaign,
      description: (
        <Link href={`/campaigns/${campaign}`} passHref>
          View campaign
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <Layout>
      <h3>Campaigns</h3>
      <Link href="/campaigns/new" passHref>
        <Button
          content="Create Campaign"
          icon="plus circle"
          floated="right"
          primary
        />
      </Link>
      <Card.Group items={items} />
    </Layout>
  );
};

// TODO: use getStaticProps instead with an
// refresh interval of 20 secs ?
export async function getServerSideProps() {
  const campaigns = await factory.methods.getCampaigns().call();
  return {
    props: {
      campaigns,
    },
  };
}

export default Index;
