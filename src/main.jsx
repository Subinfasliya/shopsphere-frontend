import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import { getCsrfToken } from './api/axiosInstance';
import { loadCurrentUser } from './redux/thunks/authThunks';
import { fetchCart } from './redux/thunks/cartThunks';
import { fetchWishlist } from './redux/thunks/wishlistThunks';
import Loader from './components/Loader';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

const Bootstrap = () => {
  const dispatch = useDispatch();
  const { initialized, isAuthenticated, loading } = useSelector((state) => state.auth);

  const bootstrapStarted = useRef(false);

  useEffect(() => {
    if (bootstrapStarted.current) return;
    bootstrapStarted.current = true;

    const start = async () => {
      await getCsrfToken().catch(() => {});
      dispatch(loadCurrentUser());
    };

    start();
  }, [dispatch]);

  useEffect(() => {
    if (initialized && isAuthenticated) { dispatch(fetchCart()); dispatch(fetchWishlist()); }
  }, [dispatch, initialized, isAuthenticated]);

  if (!initialized || loading) return <Loader label="Starting your secure session..." />;
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter><ErrorBoundary><Bootstrap /></ErrorBoundary></BrowserRouter>
    </Provider>
  </React.StrictMode>
);
