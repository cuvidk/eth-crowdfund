import React from "react";
import { Container, Menu } from "semantic-ui-react";
import Header from "./Header";
import "semantic-ui-css/semantic.min.css";

const Layout = (props) => {
  return (
    <Container>
      <Header />
      {props.children}
    </Container>
  );
};

export default Layout;
