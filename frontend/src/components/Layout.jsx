import { Outlet, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Navbar, Button } from 'react-bootstrap';
import { AuthContext } from '../authContext.js';

const Layout = () => {
  const { token, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const btnText = token ? t('layout.logOut') : t('layout.logIn');

  const handleClick = () => {
    if (token) {
      logOut();
    }
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand href="/">{t('layout.chatName')}</Navbar.Brand>
          <Button onClick={handleClick} variant="primary">{btnText}</Button>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default Layout;
