import { Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../authContext.js';
import { useContext } from 'react';

const Layout = () => {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const btnText = isLoggedIn() ? 'Выйти' : 'Войти';

  const handleClick = () => {
    if (isLoggedIn()) {
      logOut();
    }
    navigate('/login');
  }

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand href="#">Hexlet Chat</Navbar.Brand>
          <Button onClick={handleClick} variant="primary">{btnText}</Button>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default Layout;
