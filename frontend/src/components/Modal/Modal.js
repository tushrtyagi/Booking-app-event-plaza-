import React from 'react';
import { useNavigate } from 'react-router-dom';


import './Modal.css';

const Modal = props => {
  const navigate = useNavigate();
  return ( 
    <>
  <div className="modal">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <section className="modal__content">{props.children}</section>
    <section className="modal__actions">
      {props.canCancel && (
        <button className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {props.canConfirm && props.islogin &&(
        <button className="btn" onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
        {props.canConfirm && !props.islogin &&(
        <button className="btn" onClick={() => navigate('/auth')}>
          {props.confirmText}
        </button>
      )}
    </section>
  </div>
    </>
  );
}



export default Modal;