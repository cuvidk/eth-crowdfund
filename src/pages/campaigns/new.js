import React from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../CampaignFactory";
import web3 from "../../web3";

class New extends React.Component {
  state = {
    minimumContribution: "",
    loading: false,
    error: "",
    success: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, success: "", error: "" });

    try {
      const accounts = await web3.eth.requestAccounts();

      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        })
        .once("confirmation", () => {
          this.setState({
            loading: false,
            success: "Campaign created with success !",
          });
        });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false, error: err.message });
    }
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form
          onSubmit={this.onSubmit}
          error={!!this.state.error}
          success={!!this.state.success}
        >
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) => {
                this.setState({ minimumContribution: event.target.value });
              }}
            ></Input>
          </Form.Field>
          <Message success header="Yey!" content={this.state.success} />
          <Message error header="Oups!" content={this.state.error} />
          <Button
            type="submit"
            loading={this.state.loading}
            disabled={this.state.loading}
            primary
          >
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default New;
