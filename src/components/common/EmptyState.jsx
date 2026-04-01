import { AlertTriangle } from 'lucide-react';

export default function EmptyState({ icon: Icon = AlertTriangle, title, subtitle, action }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-md">
      <Icon className="text-gray-400 mx-auto mb-3" size={48} />
      <p className="text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
