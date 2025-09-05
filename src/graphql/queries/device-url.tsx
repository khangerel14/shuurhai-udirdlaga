import type { ISocketDevice, ISocketPosition } from 'src/types/socket';

import { useState, useEffect } from 'react';

export function useGetDeviceUrl() {
  const [positions, setPositions] = useState<ISocketPosition[]>([]);
  const [devices, setDevices] = useState<ISocketDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const loginAndStartPolling = async () => {
      const formData = new URLSearchParams();
      formData.append('email', 'admin');
      formData.append('password', 'Admin123456$');

      try {
        const loginRes = await fetch('http://103.50.205.212:8087/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          credentials: 'include',
          body: formData,
        });

        if (!loginRes.ok) {
          const error = await loginRes.json().catch(() => ({}));
          console.error('❌ Нэвтрэхэд алдаа:', error);
          return;
        }

        // Fetch devices once after login
        const devicesRes = await fetch('http://103.50.205.212:8087/api/devices', {
          method: 'GET',
          credentials: 'include',
        });

        if (devicesRes.ok) {
          const devicesData = await devicesRes.json();
          if (Array.isArray(devicesData)) {
            setDevices(devicesData);
          } else {
            console.warn('⚠️ Төхөөрөмжийн өгөгдөл массив биш байна:', devicesData);
          }
        } else {
          const error = await devicesRes.json().catch(() => ({}));
          console.error('❌ Төхөөрөмжийн өгөгдөл авахад алдаа:', error);
        }

        // Start polling positions every 3 seconds
        const fetchPositions = async () => {
          try {
            const positionsRes = await fetch('http://103.50.205.212:8087/api/positions', {
              method: 'GET',
              credentials: 'include',
            });

            if (positionsRes.ok) {
              const positionsData = await positionsRes.json();
              if (Array.isArray(positionsData)) {
                setPositions(positionsData);
              } else {
                console.warn('⚠️ Байршлын өгөгдөл массив биш байна:', positionsData);
              }
            } else {
              const error = await positionsRes.json().catch(() => ({}));
              console.error('❌ Байршлын өгөгдөл авахад алдаа:', error);
            }
          } catch (err) {
            console.error('❌ Байршлын өгөгдөл татахад алдаа:', err);
          }
        };

        await fetchPositions();
      } catch (err) {
        console.error('❌ Сервертэй холбогдож чадсангүй:', err);
      } finally {
        setLoading(false);
      }
    };

    loginAndStartPolling();
  }, []);

  return { positions, devices, loading };
}
