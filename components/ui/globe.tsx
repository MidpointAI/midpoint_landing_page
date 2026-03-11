"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  PerspectiveCamera,
  PointLight,
  Scene,
} from "three";
import ThreeGlobe from "three-globe";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { WebGLRenderer } from "three";
import countries from "@/data/globe.json";

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  function buildMaterial() {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }

  const globeData = useMemo(() => {
    const arcs = data;
    const points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) === i
    );

    return filteredPoints;
  }, [data, defaultProps.pointSize]);

  useEffect(() => {
    if (globeRef.current) {
      buildMaterial();
    }
  }, [globeConfig]);

  function startAnimation() {
    if (!globeRef.current || !globeData) return;

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat)
      .arcStartLng((d) => (d as { startLng: number }).startLng)
      .arcEndLat((d) => (d as { endLat: number }).endLat)
      .arcEndLng((d) => (d as { endLng: number }).endLng)
      .arcColor((e: unknown) => (e as { color: string }).color)
      .arcAltitude((e) => {
        return (e as { arcAlt: number }).arcAlt;
      })
      .arcStroke(() => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
      })
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(globeData)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((e: unknown) => () => e as string)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );
  }

  useEffect(() => {
    if (globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => {
          return defaultProps.polygonColor;
        });
      startAnimation();
    }
  }, [
    globeData,
    defaultProps.atmosphereAltitude,
    defaultProps.atmosphereColor,
    defaultProps.polygonColor,
    defaultProps.showAtmosphere,
  ]);

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      numbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5)
      );

      globeRef.current.ringsData(
        globeData.filter((d, i) => numbersOfRings.includes(i))
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [data.length, globeData]);

  // The Three.js globe is rendered programmatically, not as a React element
  return null;
}

export function World({ globeConfig, data }: WorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    autoRotate: true,
    autoRotateSpeed: 0.5,
    initialPosition: { lat: 0, lng: 0 },
    ...globeConfig,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize scene
    const scene = new Scene();
    scene.fog = new Fog(0x000000, 400, 2000);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new PerspectiveCamera(50, 1, 180, 1800);
    camera.position.z = cameraZ;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.01;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.autoRotate = defaultProps.autoRotate;
    controls.autoRotateSpeed = defaultProps.autoRotateSpeed;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;
    controlsRef.current = controls;

    // Initialize globe
    const globe = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    });

    const globeMaterial = globe.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;

    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    // Build arcs data
    globe
      .arcsData(data)
      .arcStartLat((d: unknown) => (d as Position).startLat)
      .arcStartLng((d: unknown) => (d as Position).startLng)
      .arcEndLat((d: unknown) => (d as Position).endLat)
      .arcEndLng((d: unknown) => (d as Position).endLng)
      .arcColor((d: unknown) => (d as Position).color)
      .arcAltitude((d: unknown) => (d as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((d: unknown) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    // Build points data
    const points: { lat: number; lng: number; size: number; color: string }[] = [];
    data.forEach((arc) => {
      points.push({
        lat: arc.startLat,
        lng: arc.startLng,
        size: defaultProps.pointSize,
        color: arc.color,
      });
      points.push({
        lat: arc.endLat,
        lng: arc.endLng,
        size: defaultProps.pointSize,
        color: arc.color,
      });
    });

    globe
      .pointsData(points)
      .pointColor((d) => (d as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.01)
      .pointRadius(1.5);

    globeRef.current = globe;
    scene.add(globe);

    // Add lights
    scene.add(new AmbientLight(defaultProps.ambientLight, 0.6));
    const dLight1 = new DirectionalLight(defaultProps.directionalLeftLight, 0.8);
    dLight1.position.set(-400, 100, 400);
    scene.add(dLight1);
    const dLight2 = new DirectionalLight(defaultProps.directionalTopLight, 1);
    dLight2.position.set(-200, 500, 200);
    scene.add(dLight2);
    const pLight = new PointLight(defaultProps.pointLight, 0.8);
    pLight.position.set(-200, 500, 200);
    scene.add(pLight);

    // Set initial position
    if (defaultProps.initialPosition) {
      const { lat, lng } = defaultProps.initialPosition;
      globe.rotation.y = (-lng * Math.PI) / 180;
      globe.rotation.x = (-lat * Math.PI) / 180;
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) controlsRef.current.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ aspectRatio: "1" }}
    />
  );
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

export default World;
