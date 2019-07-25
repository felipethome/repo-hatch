/* eslint-disable max-len */

import React from 'react';

const deleteIcon = function (props) {
  return (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

deleteIcon.displayName = 'deleteIcon';

export default deleteIcon;