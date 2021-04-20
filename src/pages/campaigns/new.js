import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input, Message } from "semantic-ui-react";

import Layout from "../../components/Layout";
import factory from "../../CampaignFactory";
import web3 from "../../web3";

export default function New() {
  const [minContribution, setMinContribution] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const accounts = await web3.eth.requestAccounts();

      await factory.methods
        .createCampaign(minContribution)
        .send({
          from: accounts[0],
        })
        .once("confirmation", () => {
          setLoading(false);
          setSuccess("Campaign created with success !");
          router.push("/");
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!error} success={!!success}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minContribution}
            onChange={(event) => {
              setMinContribution(event.target.value);
            }}
          ></Input>
        </Form.Field>
        <Message success header="Yey!" content={success} />
        <Message error header="Oups!" content={error} />
        <Button type="submit" loading={loading} disabled={loading} primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
}
