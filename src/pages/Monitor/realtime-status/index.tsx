import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { getProjectList, getRealTimeList } from '@/services/monitor';
import { Layout, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 实时状态
 * @param props
 * @returns
 */
const RealTime = () => {
  const [projectList, setProjectList] = useState([]);

  const getProjectData = async () => {
    const res = await getProjectList({ page: 0, size: 5000 });
    if (res && res?.content && Array.isArray(res?.content)) {
      const list = res?.content.map((item: any) => {
        return { label: item.name, value: item.id };
      });
      setProjectList(list);
    }
  };

  useEffect(() => {
    // 获取项目列表
    getProjectData();
  }, []);

  const columns = [
    {
      title: '项目名称',
      hideInTable: true,
      dataIndex: 'projectCode',
      renderFormItem: () => {
        return (
          <Select
            options={projectList}
            placeholder="请选择项目"
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        );
      },
    },
    {
      title: '局站名称',
      hideInSearch: true,
      width: 150,
      align: 'center',
      render: (record: any) => {
        return <span>{record?.deviceObject?.name || '-'}</span>;
      },
    },
    { title: '更新时间', dataIndex: 'created', hideInSearch: true, width: 100, align: 'center' },
    {
      title: '轮替时间',
      dataIndex: 'altDate',
      hideInSearch: true,
      width: 100,
      align: 'center',
      valueEnum: {
        0: '不轮替',
        1: '轮替',
      },
    },
    {
      title: '运行模式',
      dataIndex: 'mode',
      hideInSearch: true,
      width: 100,
      align: 'center',
      render: (text: { name: '' }) => {
        return <span>{text?.name}</span>;
      },
    },
    {
      title: '室外',
      hideInSearch: true,
      align: 'center',
      width: 200,
      children: [
        {
          title: '温度（°C）',
          dataIndex: 'outTemp',
          align: 'center',
          width: 80,
        },
        {
          title: '湿度（%）',
          dataIndex: 'outHu',
          align: 'center',
          width: 80,
        },
      ],
    },
    {
      title: '室内',
      dataIndex: 'created_at',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '温度（°C）',
          dataIndex: 'inTemp1',
          align: 'center',
          width: 80,
        },
        {
          title: '湿度（%）',
          dataIndex: 'inHu',
          align: 'center',
          width: 80,
        },
      ],
    },
    {
      title: '局站状态',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '风机',
          dataIndex: 'fanStatus',
          align: 'center',
          valueEnum: { 0: '关闭', 1: '开启' },
        },
        {
          title: '空调',
          dataIndex: 'airStatus',
          align: 'center',
          valueEnum: { 0: '关闭', 1: '开启' },
        },
        {
          title: '混风阀',
          dataIndex: 'valveStatus',
          align: 'center',
          valueEnum: { 0: '关闭', 1: '开启' },
        },
      ],
    },
    {
      title: '当日运行时长',
      dataIndex: 'created_at',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '风机',
          dataIndex: 'fanTime',
          align: 'center',
        },
        {
          title: '空调',
          dataIndex: 'airTime',
          align: 'center',
        },
      ],
    },
    {
      title: '电表读数',
      dataIndex: 'created_at',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '分表',
          dataIndex: 'meter2',
          align: 'center',
        },
      ],
    },
    
  ];

  return (
    <Layout className="right_layout_content">
      <CommonProTable
        columns={columns}
        fetchRequest={getRealTimeList}
        //scroll={{ x: 1800 }}
        headerTitle="实时运行状态查询"
      />
    </Layout>
  );
};

export default RealTime;
