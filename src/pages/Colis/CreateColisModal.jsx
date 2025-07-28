import React, { useRef, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Space,
    Tooltip,
    message
} from 'antd';
import {
    BarcodeOutlined,
    CameraOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { BrowserMultiFormatReader } from '@zxing/library';

const CreateColisModal = ({ visible, onCancel, onSubmit, loading }) => {
    const [form] = Form.useForm();
    const [scanning, setScanning] = useState(false);
    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());

    // Barcode scanning
    const startScanning = () => {
        setScanning(true);
        codeReader.current.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, error) => {
                if (result) {
                    form.setFieldsValue({ code_barre: result.getText() });
                    stopScanning();
                }
                if (error && !(error instanceof DOMException)) {
                    console.error('Scan error:', error);
                }
            }
        );
    };

    const stopScanning = () => {
        codeReader.current.reset();
        setScanning(false);
    };

    const handleCancel = () => {
        form.resetFields();
        stopScanning();
        onCancel();
    };

    const handleSubmit = async (values) => {
        try {
            await onSubmit(values);
            handleCancel();
        } catch (error) {
            message.error('Erreur lors de la création du colis');
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <BarcodeOutlined className="mr-2" />
                    Nouveau Colis - Code Barre
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="code_barre"
                    label="Code Barre"
                    rules={[{ required: true, message: 'Le code barre est requis' }]}
                >
                    <Input
                        placeholder="Scannez ou entrez le code barre"
                        suffix={
                            <Tooltip title="Scanner le code barre">
                                <Button
                                    type="text"
                                    icon={scanning ? <ReloadOutlined /> : <CameraOutlined />}
                                    onClick={scanning ? stopScanning : startScanning}
                                />
                            </Tooltip>
                        }
                        autoFocus
                    />
                </Form.Item>

                {scanning && (
                    <div className="mb-4">
                        <video
                            ref={videoRef}
                            style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                        />
                        <Button
                            danger
                            block
                            onClick={stopScanning}
                            className="mt-2"
                        >
                            Annuler le scan
                        </Button>
                    </div>
                )}

                <Form.Item className="mb-0">
                    <Space className="float-right">
                        <Button onClick={handleCancel}>
                            Annuler
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Confirmer
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateColisModal; 