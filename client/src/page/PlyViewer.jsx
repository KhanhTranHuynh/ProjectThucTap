import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PlyViewer = ({ plyPath }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xdddddd);
        mountRef.current.appendChild(renderer.domElement);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight2.position.set(-5, -5, -5).normalize();
        scene.add(directionalLight2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        let controls;

        const loader = new PLYLoader();
        loader.load(
            plyPath,
            (geometry) => {
                console.log('Geometry:', geometry);

                let material;
                if (geometry.attributes.color) {
                    console.log('File .ply có màu đỉnh!');
                    material = new THREE.MeshPhongMaterial({
                        vertexColors: true,
                        specular: 0x555555,
                        shininess: 50,
                    });
                } else {
                    console.log('File .ply không có màu đỉnh, dùng màu mặc định.');
                    material = new THREE.MeshPhongMaterial({
                        color: 0xaaaaaa,
                        specular: 0x555555,
                        shininess: 50,
                    });
                }

                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                geometry.computeBoundingBox();
                const boundingBox = geometry.boundingBox;
                const center = boundingBox.getCenter(new THREE.Vector3());
                const size = boundingBox.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);

                mesh.position.sub(center);

                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                camera.position.set(0, 0, cameraZ * 1.5);

                controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = false;
                controls.minDistance = 1;
                controls.maxDistance = 500;
                controls.enablePan = true;

                controls.target.set(0, 0, 0);
                controls.update();
            },
            (progress) => {
                console.log('Đang tải:', (progress.loaded / progress.total) * 100, '%');
            },
            (error) => {
                console.error('Lỗi khi tải file .ply:', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            if (controls) controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            if (controls) controls.dispose();
        };
    }, [plyPath]);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default PlyViewer;