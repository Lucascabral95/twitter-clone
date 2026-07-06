import React from 'react';
import './Spinner.scss';

const Spinner: React.FC = () => {
  return <span className="spinner" role="status" aria-label="Cargando" />;
};

export default Spinner;
