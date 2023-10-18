import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bootstrap';

const ModalRemove = (props) => {
  const { show, closeFn, title, actionSubmit } = props;
  const { t } = useTranslation();
  const handleClose = () => closeFn();

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {t('modalRemove.areYouSure')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('modalRemove.btnCancel')}
          </Button>
          <Button variant="danger" onClick={actionSubmit}>
            {t('modalRemove.btnSubmit')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalRemove;
  