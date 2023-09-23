import { Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const Layout = () => {
  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand href="#">Hexlet Chat</Navbar.Brand>
          <Button className="btn btn-primary">Войти</Button>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default Layout;
