import { Order } from '../../types/order';

interface StatusBadgeProps {
  status: Order['status'];
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 