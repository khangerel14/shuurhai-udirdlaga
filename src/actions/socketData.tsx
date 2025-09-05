'use client';

import type { ISocketPosition } from 'src/types/socket';

import { useRef, useState, useEffect, useCallback } from 'react';

function handleWebSocketMessage(
  event: MessageEvent,
  setMessages: React.Dispatch<React.SetStateAction<ISocketPosition[]>>
) {
  try {
    const data = JSON.parse(event.data);
    console.log('Raw WebSocket data:', data);

    // Handle empty data objects (like ping responses)
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    if (Array.isArray(data.positions)) {
      const validPositions = data.positions.filter(
        (pos: any): pos is ISocketPosition =>
          typeof pos.id === 'number' &&
          typeof pos.latitude === 'number' &&
          typeof pos.longitude === 'number'
      );

      if (validPositions.length !== data.positions.length) {
        console.warn('⚠️ Some positions were invalid:', data.positions);
      }

      setMessages((prevPositions) => {
        const existingPositionsMap = new Map(prevPositions.map((pos) => [pos.id, pos]));
        const existingDevicesMap = new Map(prevPositions.map((pos) => [pos.deviceId, pos]));

        // Update or add new positions
        validPositions.forEach((newPosition: ISocketPosition) => {
          const existingDevicePosition = existingDevicesMap.get(newPosition.deviceId);

          if (existingDevicePosition) {
            // Remove the old position for this device
            existingPositionsMap.delete(existingDevicePosition.id);
          }

          // Update the serverTime to current time since WebSocket sends old timestamps
          // but these are current positions
          const updatedPosition = {
            ...newPosition,
            serverTime: new Date(),
          };

          existingPositionsMap.set(newPosition.id, updatedPosition);
        });

        // Temporarily disable stale position filtering since WebSocket data has old timestamps
        // but positions are still valid
        const filteredPositions = Array.from(existingPositionsMap.values());

        return filteredPositions;
      });
    } else {
      console.warn('⚠️ Invalid data format: data.positions is not an array', data);
    }
  } catch (err) {
    console.warn('⚠️ Error parsing WebSocket data:', event.data, err);
  }
}

export const useGetSocketData = () => {
  const [messages, setMessages] = useState<ISocketPosition[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 5000;
  const lastProcessedDataRef = useRef<string>('');

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://103.50.205.212:8087/api/socket');

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      reconnectAttempts.current = 0;
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
      ws.onclose = () => clearInterval(pingInterval);
    };

    ws.onmessage = (event) => {
      // Check if we've already processed this exact data recently
      const dataHash = JSON.stringify(event.data);
      if (dataHash === lastProcessedDataRef.current) {
        console.log('🔄 Skipping duplicate data');
        return;
      }
      lastProcessedDataRef.current = dataHash;

      handleWebSocketMessage(event, setMessages);
    };

    ws.onclose = (event) => {
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current += 1;
          connectWebSocket();
        }, reconnectInterval);
      } else {
        console.error('❌ Max reconnect attempts reached.');
      }
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
      ws.close();
    };

    socketRef.current = ws;
  }, [maxReconnectAttempts, reconnectInterval]);

  useEffect(() => {
    const loginAndConnectSocket = async () => {
      const formData = new URLSearchParams();
      formData.append('email', 'admin');
      formData.append('password', 'Admin123456$');

      try {
        const res = await fetch('http://103.50.205.212:8087/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          credentials: 'include',
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          console.error('❌ Login failed:', error);
          return;
        }

        connectWebSocket();
      } catch (err) {
        console.error('❌ Failed to connect to server:', err);
      }
    };

    loginAndConnectSocket();

    return () => {
      socketRef.current?.close();
    };
  }, [connectWebSocket]);

  return { positions: messages };
};
