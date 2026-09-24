const mutationActions = /\/(add|remove|update|clear|create|capture|cancel|login|register|logout|forgot|reset|change|submit)[^/]*\/fulfilled$/i;
const ignoredErrors = /\/(loadCurrentUser)\/rejected$/i;
const successMessages = {
  loginUser: 'Welcome back.',
  registerUser: 'Account created.',
  logoutUser: 'You have been logged out.',
  updateProfile: 'Profile updated.',
  addCartItem: 'Item added to your cart.',
  addWishlist: 'Added to your wishlist.',
  removeWishlist: 'Removed from your wishlist.',
  createCodOrder: 'Order placed successfully.',
  capturePaypalOrder: 'Payment completed successfully.',
};

const readableAction = (actionType) => {
  const name = actionType.split('/')[1].replace(/([a-z])([A-Z])/g, '$1 $2');
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} completed.`;
};

const toastMiddleware = () => (next) => (action) => {
  const result = next(action);
  if (typeof window === 'undefined' || !action?.type) return result;

  if (action.type.endsWith('/rejected') && !ignoredErrors.test(action.type)) {
    window.dispatchEvent(new CustomEvent('shopsphere:toast', {
      detail: { message: action.payload || action.error?.message || 'Something went wrong.', type: 'error' },
    }));
  } else if (mutationActions.test(action.type)) {
    const actionName = action.type.split('/')[1];
    window.dispatchEvent(new CustomEvent('shopsphere:toast', {
      detail: { message: action.payload?.message || successMessages[actionName] || readableAction(action.type), type: 'success' },
    }));
  }

  return result;
};

export default toastMiddleware;