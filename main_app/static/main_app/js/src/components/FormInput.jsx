import React from 'react';
import PropTypes from 'prop-types';

function FormInput({ name, formId, defaultValue }) {
  // Capitalize first letter:
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <label className='w-full' htmlFor={`${formId}-${name}`}>
      {label}
      <input
        id={`${formId}-${name}`}
        type='text'
        className='form-control'
        defaultValue={defaultValue}
        placeholder={label}
        name={name}
      />
    </label>
  );
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};
FormInput.defaultProps = {
  defaultValue: '',
};

export default FormInput;
