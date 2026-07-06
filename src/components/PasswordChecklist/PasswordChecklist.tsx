import React from 'react';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';

import { passwordRules } from '@/infrastructure/validation/passwordRules';
import './PasswordChecklist.scss';

interface PasswordChecklistProps {
  password: string;
}

const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  return (
    <ul className="password-checklist">
      {passwordRules.map(rule => {
        const cumplida = rule.test(password ?? '');
        return (
          <li key={rule.id} className={cumplida ? 'cumplida' : 'pendiente'}>
            {cumplida ? <IoMdCheckmarkCircle className="icon" /> : <IoMdCloseCircle className="icon" />}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordChecklist;
