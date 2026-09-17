import { Link } from 'react-router';

const NotFound = () => <div className="py-20 text-center"><h1 className="text-6xl font-black">404</h1><p className="mt-3 text-slate-500">The page does not exist.</p><Link to="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Back home</Link></div>;
export default NotFound;
