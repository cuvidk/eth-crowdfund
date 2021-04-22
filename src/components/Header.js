import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href="/" passHref>
        <Menu.Item>Crowdfund</Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Link href="/" passHref>
          <Menu.Item>Campaigns</Menu.Item>
        </Link>
        <Link href="/campaigns/new" passHref>
          <Menu.Item>+</Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
