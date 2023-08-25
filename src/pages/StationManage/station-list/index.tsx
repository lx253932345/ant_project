import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { getProjectList, getStationList } from '@/services/monitor';
import { Input, Layout, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 局站列表
 * @param props
 * @returns
 */
const StationList = () => {
  const [projectList, setProjectList] = useState([]);
  const [stationList, setStationList] = useState([]);

  const getProjectData = async () => {
    const res = await getProjectList({ page: 0, size: 500 });
    if (res && res?.content && Array.isArray(res?.content)) {
      const list = res?.content.map((item: any) => {
        return { label: item.name, value: item.id };
      });
      setProjectList(list);
    }
  };

  const getStationData = async () => {
    const res = await getStationList({ page: 0, size: 500 });
    if (res && res?.content && Array.isArray(res?.content)) {
      const list = res?.content.map((item: any) => {
        return { label: item.name, value: item.name };
      });
      setStationList(list);
    }
  };

  useEffect(() => {
    // 获取项目列表
    getProjectData();
    // 获取局站列表
    getStationData();
  }, []);

  const columns = [
    { title: '局站编码', dataIndex: 'id', hideInSearch: true, align: 'center' },
    { title: '名称', dataIndex: 'name', hideInSearch: true, align: 'center' },
    { title: '所属公司', dataIndex: 'company', hideInSearch: true, align: 'center' },
    {
      title: '所属项目',
      hideInSearch: true,
      align: 'center',
      render: (record: any) => {
        return <span>{record?.project?.name || '-'}</span>;
      },
    },
    {
      title: '局站名称',
      hideInTable: true,
      dataIndex: 'name',
      renderFormItem: () => {
        return (
          <Select
            options={stationList}
            placeholder="请选择局站"
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
      title: '公司名称',
      hideInTable: true,
      dataIndex: 'company',
      renderFormItem: () => {
        return <Input placeholder="请输入公司名称" allowClear={true}></Input>;
      },
    },
    {
      title: '项目名称',
      hideInTable: true,
      dataIndex: 'project.id',
      renderFormItem: () => {
        return (
          <Select
            options={projectList}
            placeholder="请选择项目名称"
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        );
      },
    },
  ];

  return (
    <Layout className="right_layout_content">
      <h3>局站列表</h3>
      <CommonProTable columns={columns} fetchRequest={getStationList} headerTitle="" />
    </Layout>
  );
};

export default StationList;
