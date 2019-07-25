/* eslint-disable max-len */

import React from 'react';

const chevronLeftIcon = (props) => {
  return (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

chevronLeftIcon.displayName = 'chevronLeftIcon';

export default chevronLeftIcon;