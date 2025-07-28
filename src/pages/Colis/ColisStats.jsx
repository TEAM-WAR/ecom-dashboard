import React from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Divider,
    Typography,
    Table,
    Spin
} from 'antd';

const { Title } = Typography;

const ColisStats = ({ stats, loading }) => {
    return (
        <Spin spinning={loading}>
            <Card>
                {stats && (
                    <div className="space-y-6">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <Statistic
                                        title="Total Colis"
                                        value={stats.totalColis}
                                        precision={0}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <Statistic
                                        title="Montant Total"
                                        value={stats.totalMontant}
                                        precision={2}
                                        suffix="TND"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Divider />

                        <Title level={4}>Répartition par Statut</Title>
                        <Table
                            columns={[
                                { title: 'Statut', dataIndex: '_id', key: 'statut' },
                                { title: 'Nombre', dataIndex: 'count', key: 'count' },
                                { 
                                    title: 'Montant Total', 
                                    dataIndex: 'totalMontant', 
                                    key: 'totalMontant', 
                                    render: (val) => `${val} TND` 
                                }
                            ]}
                            dataSource={stats.stats}
                            rowKey="_id"
                            pagination={false}
                        />
                    </div>
                )}
            </Card>
        </Spin>
    );
};

export default ColisStats; 