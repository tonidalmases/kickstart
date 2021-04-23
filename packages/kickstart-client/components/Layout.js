import Header from './Header';
import Footer from './Footer';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

function Layout({ children }) {
  return (
    <Container style={{ paddingTop: '10px' }}>
      <Header></Header>
      {children}
      <Footer></Footer>
    </Container>
  );
}

export default Layout;
