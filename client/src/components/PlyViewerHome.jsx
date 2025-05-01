import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PlyViewer = ({ plyPath, texturePath }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = 600;
        const height = 600;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
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

                const texture = new THREE.TextureLoader().load(texturePath);

                if (!geometry.attributes.uv) {
                    const uvs = [];
                    const position = geometry.attributes.position;

                    for (let i = 0; i < position.count; i++) {
                        uvs.push(i / position.count, 0);
                    }

                    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
                }

                const material = new THREE.MeshPhongMaterial({
                    map: texture,
                    specular: 0x555555,
                    shininess: 50,
                });

                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                // Xoay mô hình để "quay ngược" trục X và Y
                mesh.rotation.x = Math.PI; // Xoay 180 độ quanh trục X (quay ngược trục Y)
                mesh.rotation.y = Math.PI; // Xoay 180 độ quanh trục Y (quay ngược trục X)

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
                controls.enableZoom = false;

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
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            if (controls) controls.dispose();
        };
    }, [plyPath, texturePath]);

    return (
        <div
            ref={mountRef}
            style={{
                width: '500px',
                height: '500px',
            }}
        />
    );
};

export default PlyViewer;