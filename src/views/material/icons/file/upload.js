/* eslint-disable max-len */

import React from 'react';

const uploadIcon = function (props) {
  return (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
    </svg>
  );
};

uploadIcon.displayName = 'uploadIcon';

export default uploadIcon;