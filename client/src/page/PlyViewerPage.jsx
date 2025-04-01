import React from 'react';
import { useParams } from 'react-router-dom';
import PlyViewer from '../components/PlyViewer';

const PlyViewerPage = () => {
    const { plyFileName } = useParams();
    const plyPath = `/plys/${plyFileName}`;

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <h1>3D Model Viewer</h1>
            <PlyViewer plyPath={plyPath} />
        </div>
    );
};

export default PlyViewerPage;