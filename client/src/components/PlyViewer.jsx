import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PlyViewer = ({ plyPath, texturePath, autoCenter = true, invertRotation = false, captureVideoFrame }) => {
    const mountRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const meshRef = useRef(null);
    const modelGroupRef = useRef(null);
    const axesHelperRef = useRef(null);
    const gridHelperRef = useRef(null);
    const [vrEnabled, setVrEnabled] = useState(false);
    const [error, setError] = useState(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [savedPosition, setSavedPosition] = useState(null);
    const [showUI, setShowUI] = useState(true);

    useEffect(() => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x1e2526, 1); // Set a solid dark background to hide white edges
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemisphereLight.position.set(0, 1, 0);
        scene.add(hemisphereLight);

        let controls;
        let distance = 10;

        const modelGroup = new THREE.Group();
        modelGroupRef.current = modelGroup;
        scene.add(modelGroup);

        const loader = new PLYLoader();
        loader.load(
            plyPath,
            (geometry) => {
                geometry.computeVertexNormals();
                geometry.center();

                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(
                    texturePath,
                    (texture) => {
                        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
                        texture.anisotropy = maxAnisotropy;
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;

                        if (!geometry.attributes.uv) {
                            const uvs = [];
                            const pos = geometry.attributes.position;
                            for (let i = 0; i < pos.count; i++) {
                                uvs.push(i / pos.count, 0);
                            }
                            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
                        }

                        const material = new THREE.MeshStandardMaterial({
                            map: texture,
                            metalness: 0.3,
                            roughness: 0.7,
                            side: THREE.DoubleSide,
                            transparent: true, // Enable transparency
                            alphaTest: 0.5 // Discard pixels with low opacity to reduce fringing
                        });

                        const mesh = new THREE.Mesh(geometry, material);
                        meshRef.current = mesh;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;

                        mesh.position.set(0, 0, 0);
                        mesh.rotation.x = Math.PI;
                        mesh.scale.set(1, 1, 1);

                        modelGroup.add(mesh);

                        const axesHelper = new THREE.AxesHelper(5);
                        axesHelperRef.current = axesHelper;
                        scene.add(axesHelper);


                        geometry.computeBoundingBox();
                        const box = geometry.boundingBox;
                        const size = box.getSize(new THREE.Vector3());
                        const maxDim = Math.max(size.x, size.y, size.z);

                        if (autoCenter) {
                            distance = maxDim / (2 * Math.tan(camera.fov * (Math.PI / 180) / 2));
                            camera.position.set(0, 0, distance * 1.5);
                            camera.lookAt(0, 0, 0);
                        } else {
                            camera.position.set(0, 0, 10);
                            camera.lookAt(0, 0, 0);
                        }

                        controls = new OrbitControls(camera, renderer.domElement);
                        controls.enableDamping = true;
                        controls.dampingFactor = 0.1;
                        controls.screenSpacePanning = true;
                        controls.minDistance = 0.5;
                        controls.maxDistance = 50;
                        controls.enablePan = true;
                        controls.panSpeed = 1.5;
                        controls.rotateSpeed = 1.2;
                        controls.target.set(0, 0, 0);
                        controls.update();

                        setSavedPosition(modelGroup.position.clone());

                        if (resetTrigger > 0) {
                            camera.position.set(0, 0, autoCenter ? distance * 1.5 : 10);
                            camera.lookAt(0, 0, 0);
                            controls.target.set(0, 0, 0);
                            modelGroup.position.set(0, 0, 0);
                            setSavedPosition(modelGroup.position.clone());
                            controls.update();
                        }

                        controls.addEventListener('change', () => {
                            if (!vrEnabled && modelGroupRef.current) {
                                setSavedPosition(modelGroupRef.current.position.clone());
                            }
                        });
                    },
                    undefined,
                    (err) => setError('Error loading texture: ' + err.message)
                );
            },
            undefined,
            (err) => setError('Error loading PLY: ' + err.message)
        );

        let touchStart = null;
        let lastTouch = null;

        const handleTouchStart = (event) => {
            if (vrEnabled && event.touches.length === 2) {
                touchStart = {
                    x1: event.touches[0].clientX,
                    y1: event.touches[0].clientY,
                    x2: event.touches[1].clientX,
                    y2: event.touches[1].clientY,
                };
                lastTouch = touchStart;
            }
        };

        const handleTouchMove = (event) => {
            if (vrEnabled && event.touches.length === 2 && touchStart && modelGroupRef.current) {
                const touchCurrent = {
                    x1: event.touches[0].clientX,
                    y1: event.touches[0].clientY,
                    x2: event.touches[1].clientX,
                    y2: event.touches[1].clientY,
                };

                const deltaY = (touchCurrent.y1 + touchCurrent.y2 - lastTouch.y1 - lastTouch.y2) / 2;
                const panSpeed = 0.01 * (autoCenter ? distance : 10);
                modelGroupRef.current.position.y += deltaY * panSpeed * (cameraRef.current.position.z / distance);

                lastTouch = touchCurrent;
            }
        };

        const handleTouchEnd = () => {
            touchStart = null;
            lastTouch = null;
            if (vrEnabled && modelGroupRef.current) {
                setSavedPosition(modelGroupRef.current.position.clone());
            }
        };

        renderer.domElement.addEventListener('touchstart', handleTouchStart);
        renderer.domElement.addEventListener('touchmove', handleTouchMove);
        renderer.domElement.addEventListener('touchend', handleTouchEnd);

        const animate = () => {
            if (!vrEnabled && controls) controls.update();
            renderer.render(scene, camera);
        };
        renderer.setAnimationLoop(animate);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('touchstart', handleTouchStart);
            renderer.domElement.removeEventListener('touchmove', handleTouchMove);
            renderer.domElement.removeEventListener('touchend', handleTouchEnd);
            renderer.setAnimationLoop(null);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            if (meshRef.current) {
                meshRef.current.geometry.dispose();
                meshRef.current.material.dispose();
                if (meshRef.current.material.map) meshRef.current.material.map.dispose();
            }
            renderer.dispose();
            if (controls) controls.dispose();
            cameraRef.current = null;
        };
    }, [plyPath, texturePath, vrEnabled, autoCenter, resetTrigger]);



    return (
        <div
            ref={mountRef}
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 5,
            }}
        >
            {error && showUI && (
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        background: 'rgba(255, 0, 0, 0.8)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        zIndex: 20,
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default PlyViewer;