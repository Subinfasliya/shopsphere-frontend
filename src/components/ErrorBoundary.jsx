import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('UI error boundary:', error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="min-h-screen bg-slate-50 p-6"><div className="mx-auto mt-20 max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-black text-slate-900">Something went wrong</h1><p className="mt-2 text-slate-500">Please refresh the page. Your secure session and server-side cart are preserved.</p><button onClick={()=>window.location.reload()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Refresh</button></div></div>;
  }
}
