import { Col, Row } from 'antd';
import { useMediaQuery } from 'react-responsive';

const ModelViewer = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const cardStyle = {
        textAlign: 'center',
        border: 'none',
        marginTop: '-20px',
    };

    const textStyle = {
        marginTop: '15px',
        fontSize: '16px',
        color: '#333',
        fontWeight: 600,
    };

    const buttonBlue = {
        marginTop: '10px',
        backgroundColor: '#00aaff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        fontWeight: 'bold',
        cursor: 'pointer',
    };

    const buttonPink = {
        ...buttonBlue,
        backgroundColor: '#e6007e',
    };

    return (
        <div
            style={{
                width: '90%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px',
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                zIndex: 10,
                position: 'relative',
                top: '-150px',
            }}
        >
            <Row gutter={[24, 24]} justify="center">
                <Col xs={24} md={8}>
                    <div style={cardStyle}>
                        <video
                            src="/videos/in3D.mp4"
                            style={{ width: '100%', borderRadius: '6px' }}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        <div style={textStyle}>
                            Quá trình in mô hình 3D từ dữ liệu số đã được tái tạo
                        </div>
                        <button style={buttonBlue}>JOIN SKETCHFAB</button>
                    </div>
                </Col>
                {isMobile ? <hr /> : <></>}
                <Col xs={24} md={8}>
                    <div style={cardStyle} >
                        <video
                            src="/videos/quaTrinh.mp4"
                            style={{ width: '100%', borderRadius: '6px' }}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        <div style={textStyle}>
                            Buy & sell 3D models<br />on Fab
                        </div>
                        <button style={buttonPink}>BUY 3D MODELS ON FAB</button>
                    </div>
                </Col>
                {isMobile ? <hr /> : <></>}
                <Col xs={24} md={8}>
                    <div style={cardStyle}>
                        <video
                            src="/videos/quaTrinh.mp4"
                            style={{ width: '100%', borderRadius: '6px' }}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        <div style={textStyle}>
                            Join millions of 3D creators and showcase your work
                        </div>
                        <button style={buttonBlue}>JOIN SKETCHFAB</button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ModelViewer;
