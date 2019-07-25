/**
 * The Material Design curves are from:
 * https://material.io/guidelines/motion/duration-easing.html
 */

export default {
  // Material Design curves. They are similar to CSS easing curves, but
  // not identical so I decided to name them like the guide.
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  deceleration: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  acceleration: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
};