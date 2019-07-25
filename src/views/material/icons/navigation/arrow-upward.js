/* eslint-disable max-len */

import React from 'react';

const arrowUpwardIcon = (props) => {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
    </svg>
  );
};

arrowUpwardIcon.displayName = 'arrowUpwardIcon';

export default arrowUpwardIcon;