import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import img from '../images/notFound.jpeg';

const NotFound = () => {
  return (
    <Container className="text-center pt-5">
      <h2>404 (not found)</h2>
      <Image src={img} />
    </Container>
  );
};

export default NotFound;
