import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Image } from 'react-bootstrap';
import img from '../images/notFound.jpeg';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container className="h-100 bg-white text-center align-items-center pt-5" fluid>
      <Image src={img} width={250} height={250} alt="page not found" fluid className="mt-5" />
      <h1 className="h4 text-muted mt-5">{t('page404.notFound')}</h1>
      <p className="text-muted">
        {t('page404.linkTo')}
        <a href="/">{t('page404.toMainPage')}</a>
      </p>
    </Container>
  );
};

export default NotFound;
