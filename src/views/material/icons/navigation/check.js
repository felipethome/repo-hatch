/* eslint-disable max-len */

import React from 'react';

const checkMarkIcon = (props) => {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
};

checkMarkIcon.displayName = 'checkMarkIcon';

export default checkMarkIcon;