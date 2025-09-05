import type { Map } from 'maplibre-gl';
import type { IDriver } from 'src/types/driver';
import type { ISocketDevice, ISocketPosition } from 'src/types/socket';

import * as THREE from 'three';
import { useMemo } from 'react';
import { LngLatBounds } from 'maplibre-gl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface I3DMarkerData {
  modelUrl: string;
  scale?: number;
  socketPosition?: ISocketPosition;
  socketDevice?: ISocketDevice;
  driver?: IDriver;
}

const modelCache = new globalThis.Map<string, THREE.Group>();
const modelOrientationCache = new globalThis.Map<string, number>();
const loader = new GLTFLoader();
const mapBearingRef = { current: 0 };

function handleMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((mat) => {
      mat.transparent = true;
      mat.alphaTest = 0.1;
    });
  } else {
    material.transparent = true;
    material.alphaTest = 0.1;
  }
}

function detectModelOrientation(model: THREE.Group): number {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  return size.z > size.x ? 90 : 0;
}

async function loadGLBModel(url: string): Promise<THREE.Group> {
  if (modelCache.has(url)) {
    return modelCache.get(url)!.clone();
  }

  return new Promise((resolve) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            handleMaterial(child.material);
          }
        });

        if (!modelOrientationCache.has(url)) {
          const correction = detectModelOrientation(model);
          modelOrientationCache.set(url, correction);
        }

        modelCache.set(url, model);
        resolve(model.clone());
      },
      () => {},
      (error) => {
        console.error('Error loading GLB model:', error);
      }
    );
  });
}

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function compassToThreeJs(compassDeg: number): number {
  return normalizeAngle(-compassDeg - 90);
}

export function useCarDirection(
  socketPosition: ISocketPosition | undefined,
  mapBearing: number,
  modelUrl: string
) {
  return useMemo(() => {
    if (!socketPosition?.attributes?.course) return 0;

    const courseDeg = socketPosition.attributes.course;
    const modelFrontCorrection = modelOrientationCache.get(modelUrl) ?? 0;
    const flipCorrection = modelUrl.toLowerCase().includes('emergency') ? 180 : 0;

    const finalCourseDeg = normalizeAngle(
      courseDeg + modelFrontCorrection - mapBearing + flipCorrection
    );
    return compassToThreeJs(finalCourseDeg);
  }, [socketPosition?.attributes?.course, mapBearing, modelUrl]);
}

export async function create3DMarkerElement(
  modelData: I3DMarkerData,
  map?: Map
): Promise<HTMLElement | object> {
  const element = document.createElement('div') as HTMLDivElement & { cleanup?: () => void };
  element.className = 'marker-3d';
  const baseSize = 80;
  let currentSize = baseSize;
  let isInitialRender = true;

  element.style.position = 'absolute';
  element.style.transform = 'translate(-50%, -50%)';
  element.style.width = `${currentSize}px`;
  element.style.height = `${currentSize}px`;

  const nameLabel = document.createElement('div');
  nameLabel.style.position = 'absolute';
  nameLabel.style.top = '-10px';
  nameLabel.style.left = '50%';
  nameLabel.style.transform = 'translateX(-50%)';
  nameLabel.style.background = 'rgba(0, 0, 0, 0.7)';
  nameLabel.style.color = 'white';
  nameLabel.style.padding = '2px 5px';
  nameLabel.style.borderRadius = '3px';
  nameLabel.style.fontSize = '12px';
  nameLabel.style.textAlign = 'center';
  nameLabel.textContent = '0°';
  element.appendChild(nameLabel);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(currentSize, currentSize);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  element.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(1, 2, 1);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const updateMarkerSize = () => {
    if (!map) return;
    const zoom = map.getZoom();
    const minZoom = 10;
    const maxZoom = 18;
    const minSize = 60;
    const maxSize = 120;

    const normalizedZoom = Math.max(0, Math.min(1, (zoom - minZoom) / (maxZoom - minZoom)));
    const newSize = Math.round(minSize + (maxSize - minSize) * normalizedZoom);

    if (newSize !== currentSize) {
      currentSize = newSize;
      element.style.width = `${currentSize}px`;
      element.style.height = `${currentSize}px`;
      renderer.setSize(currentSize, currentSize);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      camera.position.set(0, 2, 2);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
  };

  let model: THREE.Group;
  try {
    model = await loadGLBModel(modelData.modelUrl);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const originalSize = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(originalSize.x, originalSize.y, originalSize.z);
    const normalizeScale = 2.0 / maxDimension;
    model.scale.setScalar(normalizeScale);

    if (modelData.scale) {
      model.scale.multiplyScalar(modelData.scale);
    }

    scene.add(model);
    camera.position.set(0, 2, 2);
    camera.lookAt(0, 0, 0);
  } catch (error) {
    console.error('Failed to load 3D model:', error);
    model = new THREE.Group();
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    );
    model.add(cube);
    scene.add(model);
    camera.position.set(0, 2, 3);
    camera.lookAt(0, 0, 0);
  }

  if (map) {
    mapBearingRef.current = map.getBearing() ?? 0;
    map.on('rotate', () => {
      mapBearingRef.current = map.getBearing() ?? 0;
    });
    map.on('zoom', updateMarkerSize);
    updateMarkerSize();
  }

  let isRendering = true;
  let currentAngleRad = 0;

  const animate = () => {
    if (!isRendering) return;

    const courseDeg = modelData?.socketPosition?.attributes?.course ?? 0;
    const mapBearing = mapBearingRef.current;
    const modelFrontCorrection = modelOrientationCache.get(modelData.modelUrl) ?? 0;
    const flipCorrection = modelData.modelUrl.toLowerCase().includes('emergency') ? 180 : 0;

    const finalCourseDeg = normalizeAngle(
      courseDeg + modelFrontCorrection - mapBearing + flipCorrection
    );
    const threeJsDeg = compassToThreeJs(finalCourseDeg);
    const targetAngleRad = THREE.MathUtils.degToRad(threeJsDeg);

    let angleDiff = targetAngleRad - currentAngleRad;
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    if (isInitialRender) {
      currentAngleRad = targetAngleRad;
      isInitialRender = false;
    } else {
      currentAngleRad += angleDiff * 0.1;
    }

    model.rotation.set(0, currentAngleRad, 0);

    nameLabel.textContent = `${modelData?.driver?.vehicle?.licencePlate ?? modelData?.socketDevice?.uniqueId}`;
    renderer.render(scene, camera);
  };

  animate();

  if (map) {
    map.on('render', animate);
  }

  element.cleanup = () => {
    isRendering = false;
    if (map) {
      map.off('zoom', updateMarkerSize);
      map.off('render', animate);
    }
    renderer.dispose();
    scene.clear();
  };

  return element;
}

export function setModelOrientationOverride(modelUrl: string, correctionDegrees: number) {
  modelOrientationCache.set(modelUrl, correctionDegrees);
}

export function getModelOrientationCorrection(modelUrl: string): number {
  return modelOrientationCache.get(modelUrl) ?? 0;
}

export function clearOrientationCache() {
  modelOrientationCache.clear();
}

export function testModelOrientation(modelUrl: string, testDegrees = [0, 90, 180, 270]) {
  testDegrees.forEach((deg) => {
    setModelOrientationOverride(modelUrl, deg);
  });
}

export function calculateMapCenter(coordinates: any) {
  if (coordinates.length === 0) return null;

  let sumLat = 0,
    sumLng = 0;
  for (const coord of coordinates) {
    sumLat += coord[1];
    sumLng += coord[0];
  }

  return [sumLng / coordinates.length, sumLat / coordinates.length];
}

export function mapFitBounds(locationsStart: any, locationsEnd: any, map: Map) {
  const center: any = calculateMapCenter([locationsStart, locationsEnd]);
  map.setCenter(center);
  const bounds = [locationsStart, locationsEnd].reduce(
    (acc, coord) => acc.extend(coord),
    new LngLatBounds(locationsStart, locationsEnd)
  );
  map.fitBounds(bounds, { padding: 150 });
}

export const createCustomMarkerElement = (url: string) => {
  const element = document.createElement('div');
  element.className = 'source-marker';
  element.style.backgroundImage = url;
  element.style.width = '35px';
  element.style.height = '35px';
  element.style.backgroundSize = 'contain';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.display = 'block';
  element.style.backgroundPosition = 'center';

  return element;
};

export function isMarkerExists(map: Map, uniqueId: string): boolean {
  const markers = (map as any).getMarkers();
  return markers.some((marker: any) => {
    const element = marker.getElement();
    const nameLabel = element.querySelector('.marker-3d div');
    return nameLabel?.textContent === uniqueId;
  });
}

export function removeExistingMarker(map: Map, uniqueId: string) {
  const markers = (map as any).getMarkers();
  markers.forEach((marker: any) => {
    const element = marker.getElement();
    const nameLabel = element.querySelector('.marker-3d div');
    if (nameLabel?.textContent === uniqueId) {
      marker.remove();
    }
  });
}
