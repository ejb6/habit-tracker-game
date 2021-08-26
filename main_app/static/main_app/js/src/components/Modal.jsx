import React from "react";

// Used for creating modals
// Content can be a react app
export default function Modal({title, content, footer, modal_id}) {
  return (
    <div 
      className="modal fade"
      id={modal_id} tabIndex="-1"
      aria-labelledby="addTodoModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className="modal-title"
              id="addTodoModal"
            >
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            {content}
          </div>
          <div className="modal-footer">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
