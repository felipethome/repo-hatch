/* eslint-disable max-len */

import React from 'react';

const removeIcon = function (props) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M19 13H5v-2h14v2z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

removeIcon.displayName = 'removeIcon';

export default removeIcon;