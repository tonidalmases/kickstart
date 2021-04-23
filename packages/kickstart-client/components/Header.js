import { Menu, Icon } from 'semantic-ui-react';
import Link from 'next/link';

function Header() {
  return (
    <Menu>
      <Link href="/">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link href="/campaigns/new">
          <a className="item">
            <Icon name="add circle" />
            Create campaign
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
