import React from 'react';
import './toggle.css';

const ToggleSwitch = ({ isChecked, onToggle }) => {
  return (
    <div className="toggle-switch">
      <label className="switch-label">
        <input
          type="checkbox"
          className="checkbox"
          checked={isChecked}
          onChange={onToggle}       
        />
        <span className="slider"></span>
      </label>
    </div>  
  );
}

export default ToggleSwitch;
