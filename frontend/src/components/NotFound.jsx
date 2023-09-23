import { Container } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import img from '../images/notFound.jpeg';

const NotFound = () => {
  return (
    <Container className="h-100 bg-white text-center align-items-center pt-5" fluid>
      <Image src={img} width={250} height={250} alt="page not found" fluid className="mt-5" />
      <h1 className="h4 text-muted mt-5">Страница не найдена</h1>
      <p className="text-muted">Но вы можете перейти <a href="/">на главную страницу</a></p>
    </Container>
  );
};

export default NotFound;
