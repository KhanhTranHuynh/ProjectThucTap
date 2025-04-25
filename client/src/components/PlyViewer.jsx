import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PlyViewer = ({ plyPath, texturePath }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Màu nền trong suốt
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

                // Tải texture từ file PNG
                const texture = new THREE.TextureLoader().load(texturePath);

                // Kiểm tra xem geometry có thuộc tính UV không
                if (!geometry.attributes.uv) {
                    // Nếu không có UV, tạo UV đơn giản cho mỗi điểm
                    const uvs = [];
                    const position = geometry.attributes.position;

                    for (let i = 0; i < position.count; i++) {
                        uvs.push(i / position.count, 0); // UV đơn giản, bạn có thể thay đổi logic tạo UV ở đây
                    }

                    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
                }

                // Sử dụng MeshPhongMaterial với texture đã tải
                const material = new THREE.MeshPhongMaterial({
                    map: texture,
                    specular: 0x555555,
                    shininess: 50,
                });

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
    }, [plyPath, texturePath]);

    return <div ref={mountRef} style={{ width: '88vw', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />;
};

export default PlyViewer;
