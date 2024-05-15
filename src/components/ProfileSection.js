// ProfileSection.js
import React from 'react';

const ProfileSection = ({ data }) => {
  return (
    <div className='flex items-center'>
      <div className="mr-3 ">
        <div>
          <button
            type="button"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <img
              className="inline-block rounded-full ring ring-white w-9 h-9"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
            />
          </button>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-[#081225] text-base antialiased">
          {data?.email || 'Not Found'}
        </h1>
        <h1 className="font-normal text-[#081225] text-sm antialiased opacity-55">
          {data?.role || 'Not Found'}
        </h1>
      </div>
    </div>
  );
};

export default ProfileSection;
