import React from "react";
import { Button, Container, Card } from "semantic-ui-react";
import web3 from "../web3";
import factory from "../CampaignFactory";
import "../components/Layout";
import Layout from "../components/Layout";

export default class Index extends React.Component {
  static async getInitialProps(context) {
    const campaigns = await factory.methods.getCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    return this.props.campaigns.map((campaign) => {
      return {
        header: campaign,
        description: <a>View campaign</a>,
        fluid: true,
      };
    });
  }

  render() {
    return (
      <Layout>
        <h3>Campaigns</h3>
        <Button
          content="Create Campaign"
          icon="plus circle"
          floated="right"
          primary
        />
        <Card.Group items={this.renderCampaigns()} />
      </Layout>
    );
  }
}
