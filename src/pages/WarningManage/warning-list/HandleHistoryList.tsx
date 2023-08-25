import { handleWarningList } from '@/services/warning';
import { Table } from 'antd';
import { useEffect, useState } from 'react';

// 处理历史
const HistoryList = (props: any) => {
  const { eventId = '' } = props;
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getHistoryList = async () => {
    setLoading(true);
    const res = await handleWarningList({ eventId });
    if (res && Array.isArray(res)) {
      setDataList(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    getHistoryList();
  }, []);

  const columns: any = [
    { title: '时间', dataIndex: 'created', align: 'center' },
    { title: '处理人员', dataIndex: 'person', align: 'center' },
    {
      title: '处理状态',
      align: 'center',
      render: (record: any) => <span>{record?.eventProcessingMessage?.name}</span>,
    },
    { title: '处理描述', dataIndex: 'desc', align: 'center' },
    { title: '记录人', dataIndex: 'operator', align: 'center' },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={dataList} loading={loading} />
    </div>
  );
};

export default HistoryList;
