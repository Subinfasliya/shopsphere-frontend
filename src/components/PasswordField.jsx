import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ value, onChange, placeholder, minLength = 8, required = true }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input required={required} minLength={minLength} type={visible ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12" />
      <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordField;
