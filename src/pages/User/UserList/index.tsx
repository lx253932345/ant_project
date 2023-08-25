import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { getRoleList, getUserList } from '@/services/login';
import { getProjectList } from '@/services/monitor';
import { Input, Layout, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 用户列表
 * @param props
 * @returns
 */
const UserList = () => {
  const [projectList, setProjectList] = useState([]);
  const [roleList, setRoleList] = useState<any[]>([]);

  const getProjectData = async () => {
    const res = await getProjectList({ page: 0, size: 500 });
    if (res && res?.content && Array.isArray(res?.content)) {
      const list = res?.content.map((item: any) => {
        return { label: item.name, value: item.id };
      });
      setProjectList(list);
    }
  };

  const getRole = async () => {
    const res = await getRoleList();
    if (res && Array.isArray(res)) {
      const list = res.map((item: any) => {
        return { label: item.name, value: item.code };
      });
      setRoleList(list);
    }
  };

  useEffect(() => {
    // 获取项目列表
    getProjectData();
    getRole();
  }, []);

  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
      align: 'center',
      renderFormItem: () => {
        return <Input placeholder="请输入用户名称" />;
      },
    },
    {
      title: '公司名称',
      dataIndex: 'company',
      align: 'center',
      renderFormItem: () => {
        return <Input placeholder="请输入公司名称" />;
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: 'center',
      renderFormItem: () => {
        return (
          <Select
            options={roleList}
            placeholder="请选择角色"
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        );
      },
      render: (_, record: any) => {
        return <span>{record?.role?.name || '-'}</span>;
      },
    },
    {
      title: '所属项目',
      dataIndex: 'project.id',
      align: 'center',
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
      render: (_, record: any) => <span>{record?.project?.name || '-'}</span>,
    },
  ];

  return (
    <Layout className="right_layout_content">
      <h3>用户列表</h3>
      <CommonProTable
        columns={columns}
        fetchRequest={getUserList}
        headerTitle=""
        search={{ defaultCollapsed: false }}
      />
    </Layout>
  );
};

export default UserList;
