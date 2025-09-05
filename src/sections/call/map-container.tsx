import 'maplibre-gl/dist/maplibre-gl.css';

import type { IDriver } from 'src/types/driver';
import type { I3DMarkerData } from 'src/utils/map';
import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { ISocketDevice, ISocketPosition } from 'src/types/socket';

import { createRoot } from 'react-dom/client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Popup, Marker, NavigationControl, Map as MaplibreMap } from 'maplibre-gl';

import FireTruckIcon from '@mui/icons-material/FireTruck';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';

import { create3DMarkerElement } from 'src/utils/map';
import { getVehicle3DMarkerData } from 'src/utils/format-status';

import Loading from 'src/app/loading';
import { useGetImapTile } from 'src/actions/imap-tile';

import { DRIVER_TYPE_ENUM } from 'src/types/common';

import type { SetLocationType } from './view/call-list-board-view';

const initialMapState = {
  lng: 105.92424,
  lat: 49.479159,
  zoom: 13,
  maxZoom: 17,
  minZoom: 12,
};

const contextMenuItems = [
  { label: 'Эмнэлэг', icon: <LocalHospitalIcon />, action: DRIVER_TYPE_ENUM.AMBULANCE },
  { label: 'Цагдаа', icon: <LocalPoliceIcon />, action: DRIVER_TYPE_ENUM.POLICE },
  { label: 'Онгой', icon: <FireTruckIcon />, action: DRIVER_TYPE_ENUM.EMERGENCY },
];

type Props = Readonly<{
  drivers: IDriver[];
  selected: number | null;
  dialog: UseBooleanReturn;
  socketDevices: ISocketDevice[];
  setSelected: (id: number) => void;
  socketPositions: ISocketPosition[];
  setLocation: (location: SetLocationType) => void;
}>;

interface MarkerElement extends HTMLElement {
  cleanup?: () => void;
}

export function MapContainer({
  dialog,
  drivers,
  selected,
  setSelected,
  setLocation,
  socketDevices,
  socketPositions,
}: Props) {
  const mapContainerRef = useRef(null);
  const currentPopupRef = useRef<Popup | null>(null);
  const markersRef = useRef<Map<number, Marker>>(new Map<number, Marker>());
  const [mapInstance, setMapInstance] = useState<MaplibreMap | null>(null);

  const { url, loading } = useGetImapTile();

  const handleMarkerClick = useCallback(
    (map: MaplibreMap, coordinates: { lng: number; lat: number }, socketPositionId: number) => {
      map.easeTo({
        center: [coordinates.lng, coordinates.lat],
        duration: 1000,
      });
      setSelected(socketPositionId);
    },
    [setSelected]
  );

  const createMarker = useCallback(
    async (
      map: MaplibreMap,
      modelData: I3DMarkerData,
      coordinates: [number, number],
      socketPosition: ISocketPosition,
      draggable = false
    ) => {
      const element = (await create3DMarkerElement(modelData, map)) as HTMLElement;

      const marker = new Marker({
        draggable,
        element,
        anchor: 'center',
      })
        .setLngLat(coordinates)
        .addTo(map);
      marker.getElement().addEventListener('click', () => {
        const socketPositionData = modelData.socketPosition || socketPosition;
        const socketPositionId = socketPositionData?.id;

        handleMarkerClick(map, marker.getLngLat(), socketPositionId);
      });

      return marker;
    },
    [handleMarkerClick]
  );

  const closePopup = useCallback(() => {
    if (currentPopupRef?.current) {
      currentPopupRef?.current.remove();
      currentPopupRef.current = null;
    }
  }, []);

  const openPopup = useCallback(
    (longitude: number, latitude: number, domContent: any) => {
      closePopup();

      if (domContent && mapInstance) {
        const popup = new Popup({ closeOnClick: false })
          .setLngLat([longitude, latitude])
          .setDOMContent(domContent)
          .addTo(mapInstance);
        currentPopupRef.current = popup;
      }
    },
    [mapInstance, closePopup]
  );

  const handleLocationSelect = useCallback(
    (type: DRIVER_TYPE_ENUM, coordinates: { lng: number; lat: number }) => {
      setLocation({
        type,
        longitude: coordinates.lng,
        latitude: coordinates.lat,
      });
      closePopup();

      if (mapInstance) {
        createMarker(
          mapInstance,
          {
            modelUrl: '/assets/models/truck.glb',
            scale: 0.5,
          },
          [coordinates.lng, coordinates.lat],
          {} as ISocketPosition,
          false
        ).catch(console.error);
      }
    },
    [mapInstance, setLocation, closePopup, createMarker]
  );

  const showContextMenu = useCallback(
    (e: any) => {
      const rootElement = document.createElement('div');
      const root = createRoot(rootElement);

      root.render(
        <List
          sx={{
            width: 120,
            maxWidth: 120,
            backgroundColor: 'background.paper',
            p: 0,
          }}
        >
          {contextMenuItems.map((item) => (
            <ListItem key={item.action} disablePadding>
              <ListItemButton
                sx={{ p: 0, color: 'text.primary' }}
                onClick={() => {
                  handleLocationSelect(item.action, e.lngLat);
                  dialog.onTrue();
                }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>{item.icon}</ListItemIcon>
                <ListItemText sx={{ fontSize: 12 }} primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      );

      openPopup(e.lngLat.lng, e.lngLat.lat, rootElement);
    },
    [handleLocationSelect, openPopup, dialog]
  );

  useEffect(() => {
    if (!mapInstance) return;

    const handleMapContextMenu = (e: any) => {
      e.preventDefault();
      showContextMenu(e);
    };

    mapInstance.on('contextmenu', handleMapContextMenu);
  }, [mapInstance, showContextMenu]);

  const isInViewport = useCallback((coordinates: [number, number], map: MaplibreMap) => {
    const bounds = map.getBounds();
    return bounds.contains(coordinates);
  }, []);

  const updateMarkerPosition = useCallback((marker: Marker, newPosition: [number, number]) => {
    const currentPosition = marker.getLngLat();
    const newLngLat = { lng: newPosition[0], lat: newPosition[1] };

    if (currentPosition.lng !== newLngLat.lng || currentPosition.lat !== newLngLat.lat) {
      marker.setLngLat(newLngLat);
    }
  }, []);

  const cleanupMarker = useCallback((marker: Marker) => {
    const element = marker.getElement() as MarkerElement;
    if (element.cleanup) {
      element.cleanup();
    }
    marker.remove();
  }, []);

  const processSingleSocketPosition = useCallback(
    async (socketPosition: ISocketPosition, map: MaplibreMap) => {
      const markerId = socketPosition.id;
      const coordinates: [number, number] = [socketPosition.longitude, socketPosition.latitude];

      if (!isInViewport(coordinates, map)) {
        if (markersRef.current.has(markerId)) {
          const marker = markersRef.current.get(markerId);
          if (marker) {
            cleanupMarker(marker);
            markersRef.current.delete(markerId);
          }
        }
        return;
      }

      if (markersRef.current.has(markerId)) {
        const marker = markersRef.current.get(markerId);
        if (marker) {
          updateMarkerPosition(marker, coordinates);
        }
        console.log(drivers, 'outer');
      } else {
        console.log(drivers, 'inner');
        const modelData = getVehicle3DMarkerData(socketPosition, drivers, socketDevices);

        if (!modelData.driver && drivers.length === 0) {
          console.log('Skipping marker creation - waiting for drivers data');
          return;
        }

        const marker = await createMarker(map, modelData, coordinates, socketPosition);
        markersRef.current.set(markerId, marker);
      }
    },
    [drivers, createMarker, socketDevices, isInViewport, updateMarkerPosition, cleanupMarker]
  );

  const removeStaleMarkers = useCallback(
    (sockets: ISocketPosition[]) => {
      const currentIds = new Set(sockets.map((s) => s.id));
      for (const [id, marker] of markersRef.current.entries()) {
        if (!currentIds.has(id)) {
          cleanupMarker(marker);
          markersRef.current.delete(id);
        }
      }
    },
    [cleanupMarker]
  );

  const executeMarkerDrawingOperations = useCallback(
    async (sockets: ISocketPosition[], map: MaplibreMap) => {
      try {
        for (const socketPosition of sockets) {
          await processSingleSocketPosition(socketPosition, map);
        }

        removeStaleMarkers(sockets);
      } catch (error) {
        console.error('Error updating markers:', error);
      }
    },
    [processSingleSocketPosition, removeStaleMarkers]
  );

  const drawDriver3DMarkers = useCallback(
    async (sockets: ISocketPosition[]) => {
      if (!mapInstance || !sockets) {
        return;
      }

      await executeMarkerDrawingOperations(sockets, mapInstance);
    },
    [mapInstance, executeMarkerDrawingOperations]
  );

  useEffect(() => {
    if (mapInstance && socketPositions) {
      requestAnimationFrame(() => {
        drawDriver3DMarkers(socketPositions);
      });
    }
  }, [mapInstance, socketPositions, drawDriver3DMarkers]);

  useEffect(
    () => () => {
      for (const marker of markersRef.current.values()) {
        cleanupMarker(marker);
      }
      markersRef.current.clear();
    },
    [cleanupMarker]
  );

  useEffect(() => {
    if (mapContainerRef?.current && !mapInstance && !loading) {
      const initializeMap = () => {
        try {
          const map = new MaplibreMap({
            container: mapContainerRef?.current ?? '',
            style: url ?? 'https://demotiles.maplibre.org/style.json',
            maxZoom: initialMapState.maxZoom,
            minZoom: initialMapState.minZoom,
          });

          map.on('error', (e) => {
            console.error('Map error:', e);
            if (url) {
              map.setStyle(url);
            }
          });

          map.on('load', () => {
            console.log('Map loaded successfully');
          });

          map.on('style.load', () => {
            console.log('Map style loaded successfully');
          });

          map.on('style.error', (e) => {
            console.error('Map style error:', e);
            if (url) {
              map.setStyle(url);
            }
          });

          map.addControl(new NavigationControl(), 'bottom-right');
          map.setCenter([initialMapState.lng, initialMapState.lat]);

          setMapInstance(map);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };

      initializeMap();
    }
  }, [mapInstance, url, loading]);

  useEffect(() => {
    if (mapInstance && url) {
      try {
        mapInstance.setStyle(url);
      } catch (error) {
        console.error('Error updating map style:', error);
      }
    }
  }, [mapInstance, url]);

  useEffect(() => {
    if (mapInstance) {
      const handleMapError = () => {
        if (url) {
          try {
            mapInstance.setStyle(url);
          } catch (error) {
            console.error('Error recovering map:', error);
          }
        }
        return undefined;
      };

      mapInstance.on('error', handleMapError);
      return () => {
        mapInstance.off('error', handleMapError);
      };
    }
    return undefined;
  }, [mapInstance, url]);

  useEffect(() => {
    if (!mapInstance || selected == null || !socketPositions.length) return;

    const matched = socketPositions.find((pos) => pos.id === selected);
    if (matched) {
      mapInstance.easeTo({
        center: [matched.longitude, matched.latitude],
        duration: 1000,
      });
    }
  }, [selected, socketPositions, mapInstance]);

  useEffect(
    () => () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
        setMapInstance(null);
      }
    },
    [mapInstance]
  );

  if (loading) return <Loading />;

  return (
    <Box
      sx={{ borderRadius: 3, border: '1px solid #ccc', width: '100%' }}
      ref={mapContainerRef}
      className="map"
      style={{ height: '800px' }}
    />
  );
}
