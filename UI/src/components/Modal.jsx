import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalPopup({
  show,
  setShow,
  showClose,
  title,
  body,
  primaryBtnText,
  primaryBtnHandler,
}) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={showClose}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ display: !showClose ? "none" : "block" }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={primaryBtnHandler}>
            {primaryBtnText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalPopup;
