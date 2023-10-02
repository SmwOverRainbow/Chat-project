// import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalRemove = (props) => {
  const { show, closeFn, title, actionSubmit, /* nameChannel, id */ } = props;
  // console.log('nameChannel', nameChannel);
  const handleClose = () => closeFn();

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Уверены?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="danger" onClick={actionSubmit}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalRemove;
  