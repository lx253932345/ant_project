import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { getStationList } from '@/services/monitor';
import {
  handleStatusList,
  saveEventStatus,
  warningCodeList,
  warningList,
} from '@/services/warning';
import { Button, DatePicker, Form, Layout, message, Modal, Select } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import EditStatus from './EditStatus';
import HistoryList from './HandleHistoryList';

const { RangePicker } = DatePicker;

/**
 * 告警信息列表
 * @param props
 * @returns
 */
const WarningList = () => {
  const [eventCodeList, setEventCodeList] = useState<any[]>([]);
  const [handleStatusData, setHandleList] = useState<any[]>([]);
  const [stationList, setStationList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currEventId, setCurrEventId] = useState('');
  const [handleVisible, setHandleVisible] = useState(false);
  const [form] = Form.useForm();

  // 局站数据
  const getStationData = async () => {
    const res = await getStationList({ page: 0, size: 500 });
    if (res && res?.content && Array.isArray(res?.content)) {
      const list = res?.content.map((item: any) => {
        return { label: item.name, value: item.id };
      });
      setStationList(list);
    }
  };

  // 事件类型
  const getEventCodeList = async () => {
    const res = await warningCodeList();
    if (res && Array.isArray(res)) {
      const list = res.map((item: any) => {
        return { label: item.name, value: item.code.toString() };
      });
      setEventCodeList(list);
    }
  };

  // 处理状态
  const getHandleStatusList = async () => {
    const res = await handleStatusList();
    if (res && Array.isArray(res)) {
      const list = res.map((item: any) => {
        return { label: item.name, value: item.code.toString() };
      });
      setHandleList(list);
    }
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
    // 事件类型列表
    getEventCodeList();
    // 获取处理状态列表
    getHandleStatusList();
  }, []);

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().startOf('day');
  };

  const onHandle = (record: any) => {
    setCurrEventId(record?.id);
    setModalVisible(true);
  };

  // 关闭处理历史列表
  const onCloseHistoryModal = () => {
    setModalVisible(false);
    setCurrEventId('');
  };

  // 取消
  const handleCancel = () => {
    setHandleVisible(false);
    form.resetFields();
    setCurrEventId('');
  };

  // 保存处理
  const saveHandleStatus = async (param: any) => {
    const res = await saveEventStatus(param);
    if (res && res?.id) {
      message.success('处理成功');
      handleCancel();
    } else {
      message.error('处理失败');
    }
  };

  // 确认提交
  const handleEvent = () => {
    form
      .validateFields()
      .then((values) => {
        // console.log('values', values);
        const params = {
          desc: values.desc,
          person: values.person,
          eventProcessingMessage: { code: values.processingCode },
          warningEventId: currEventId,
        };
        saveHandleStatus(params);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // 打开编辑弹窗
  const onOpenEvent = (record: any) => {
    setCurrEventId(record?.id);
    setHandleVisible(true);
  };

  const columns = [
    {
      title: '时间范围',
      hideInTable: true,
      dataIndex: 'queryDate',
      valueType: 'dateRange',
      renderFormItem: () => {
        return <RangePicker disabledDate={disabledDate} allowClear={true} />;
      },
    },
    {
      title: '局站',
      align: 'center',
      dataIndex: 'deviceCode',
      render: (_, record: any) => {
        return <span>{record?.device?.name || '-'}</span>;
      },
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
    { title: '日期', dataIndex: 'created', hideInSearch: true, align: 'center' },
    {
      title: '告警名称',
      dataIndex: 'warningCode',
      align: 'center',
      renderFormItem: () => {
        return (
          <Select
            options={eventCodeList}
            placeholder="请选择告警名称"
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        );
      },
      render: (_, record: any) => {
        return <span>{record?.warningMessage?.name || '-'}</span>;
      },
    },
    { title: '告警设备号', dataIndex: 'warningDeviceId', hideInSearch: true, align: 'center' },
    {
      title: '报警状态',
      align: 'center',
      dataIndex: 'processingCode',
      render: (_, record: any) => {
        return <span>{record?.eventProcessingMessage?.name || '-'}</span>;
      },
      renderFormItem: () => {
        return (
          <Select
            options={handleStatusData}
            placeholder="请选择报警状态"
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
      title: '处理时间',
      hideInSearch: true,
      align: 'center',
      render: (record: any) => {
        return <span>{record?.updated || '-'}</span>;
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (record: any) => {
        return (
          <div>
            <Button type="link" style={{ marginRight: 10 }} onClick={() => onHandle(record)}>
              处理历史
            </Button>
            <Button type="link" onClick={() => onOpenEvent(record)}>
              处理
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout className="right_layout_content">
      <h3>告警信息</h3>
      <CommonProTable
        columns={columns}
        fetchRequest={warningList}
        headerTitle=""
        search={{ defaultCollapsed: false }}
        searchParams={{ name: 'queryDate', value: ['fromDate', 'toDate'] }}
      />
      <Modal
        title="事件处理历史"
        open={modalVisible}
        onCancel={onCloseHistoryModal}
        width={800}
        footer={null}
        destroyOnClose={true}
      >
        <HistoryList eventId={currEventId} />
      </Modal>
      <Modal
        title="事件处理"
        open={handleVisible}
        onOk={handleEvent}
        onCancel={handleCancel}
        width={500}
        destroyOnClose={true}
      >
        <EditStatus handleStatusData={handleStatusData} form={form} />
      </Modal>
    </Layout>
  );
};

export default WarningList;
