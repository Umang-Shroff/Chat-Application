import React, { useState, useEffect } from 'react';
import ToggleSwitch from '../toggle/ToggleSwitch';

const SideBar = () => {
    
    const [clicked, setClicked] = useState(false);

    const iconTheme = clicked===false?"bg-blue-700":"bg-blue-300";
    const bgTheme = clicked===false?"bg-white":"bg-gray-600";

return (
    <>
    <div className={`flex items-center flex-col pt-6 w-24 h-screen border-gray-300 border-r-2 ${bgTheme}`}>
      {/* Image Section */}
      <div className={`flex justify-center border rounded-lg ${iconTheme} h-16 w-16 mb-4`}>
        {/* image */}
      </div>

      {/* Chat Icon 1 */}
      <div className={`h-12 w-12 bg-blue-400 border mt-9 rounded-lg ${iconTheme}`}>
        {/* Chat Icon */}
      </div>

      {/* Chat Icon 2 */}
      <div className={`h-12 w-12 bg-blue-400 border mt-6 rounded-lg ${iconTheme}`}>
        {/* Chat Icon */}
      </div>

      {/* Theme Toggle Switch */}
      <div className="absolute bottom-28">
        <ToggleSwitch isChecked={clicked} onToggle={() => setClicked(prev => !prev)} />
      </div>

      {/* Profile Icon */}
      <div className={`absolute bottom-6 h-16 w-16 border rounded-full ${iconTheme}`}>
        {/* Profile */}
      </div>
    </div>


    </>
  );
};

export default SideBar;