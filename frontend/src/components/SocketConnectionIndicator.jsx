/**
 * Socket Connection Status Indicator
 * Displays the current WebSocket connection status
 */
import { useEffect, useState } from 'react';
import useSocketStore from '../store/useSocketStore';

const SocketConnectionIndicator = ({ className = '' }) => {
  const { isConnected, reconnectAttempts, error } = useSocketStore();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Show indicator when disconnected or reconnecting
    if (!isConnected || reconnectAttempts > 0 || error) {
      setShowIndicator(true);
    } else {
      // Hide indicator after a brief delay when connected
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, reconnectAttempts, error]);

  if (!showIndicator && isConnected) {
    return null;
  }

  const getStatusInfo = () => {
    if (error) {
      return {
        text: 'Connection Error',
        color: 'bg-red-500',
        icon: '⚠️',
      };
    }
    if (reconnectAttempts > 0) {
      return {
        text: `Reconnecting... (${reconnectAttempts})`,
        color: 'bg-yellow-500',
        icon: '🔄',
      };
    }
    if (!isConnected) {
      return {
        text: 'Disconnected',
        color: 'bg-gray-500',
        icon: '⭕',
      };
    }
    return {
      text: 'Connected',
      color: 'bg-green-500',
      icon: '✓',
    };
  };

  const status = getStatusInfo();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white ${status.color} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-xs" aria-hidden="true">
        {status.icon}
      </span>
      <span>{status.text}</span>
      {isConnected && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
    </div>
  );
};

export default SocketConnectionIndicator;
