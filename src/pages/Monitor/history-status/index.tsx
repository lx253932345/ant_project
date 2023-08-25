import downloadExcel from '@/components/DownLoad';
import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { exportHistoryStatusList, getHistoryStatusList, getStationList } from '@/services/monitor';
import { Button, DatePicker, Layout, message, Select } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

/**
 * 按日统计运行数据
 * @param props
 * @returns
 */
const HistoryStatus = () => {
  const [stationList, setStationList] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  const getStationData = async () => {
    const res = await getStationList({ page: 0, size: 500 });
    if (res && res?.content && Array.isArray(res?.content)) {
      const list = res?.content.map((item: any) => {
        return { label: item.name, value: item.id };
      });
      setStationList(list);
    }
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
  }, []);

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().startOf('day');
  };

  const downLoad = async () => {
    const params = { ...searchParams };
    delete params.page;
    delete params.size;
    const res = await exportHistoryStatusList(params);
    // console.log('res', res)
    if (res) {
      const fileName = `历史运行状态_${new Date().valueOf()}.xlsx`;
      downloadExcel(res, fileName);
    } else {
      message.warning('导出操作异常');
    }
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
      title: '局站名称',
      width: 150,
      align: 'center',
      dataIndex: 'deviceCode',
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
      render: (_, record: any) => {
        return <span>{record?.deviceObject?.name || '-'}</span>;
      },
    },
    {
      title: '日期',
      dataIndex: 'created',
      hideInSearch: true,
      width: 100,
      align: 'center',
      valueType: 'date',
    },
    {
      title: '室外温度（°C）',
      hideInSearch: true,
      align: 'center',
      width: 200,
      children: [
        {
          title: '最低',
          dataIndex: 'outTempLow',
          align: 'center',
          width: 80,
        },
        {
          title: '最高',
          dataIndex: 'outTempHigh',
          align: 'center',
          width: 80,
        },
        {
          title: '平均',
          dataIndex: 'outTemp',
          align: 'center',
          width: 80,
        },
      ],
    },
    {
      title: '室内温度（°C）',
      hideInSearch: true,
      align: 'center',
      width: 200,
      children: [
        {
          title: '最低',
          dataIndex: 'inTempLow',
          align: 'center',
          width: 80,
        },
        {
          title: '最高',
          dataIndex: 'inTempHigh',
          align: 'center',
          width: 80,
        },
        {
          title: '平均',
          dataIndex: 'inTemp',
          align: 'center',
          width: 80,
        },
      ],
    },
    { title: '室外湿度（%）', dataIndex: 'outHu', hideInSearch: true, width: 100, align: 'center' },
    { title: '室内湿度（%）', dataIndex: 'inHu', hideInSearch: true, width: 100, align: 'center' },
    {
      title: '风机运行时长',
      dataIndex: 'fanTime',
      hideInSearch: true,
      width: 100,
      align: 'center',
    },
    {
      title: '空调运行时长',
      dataIndex: 'airTime',
      hideInSearch: true,
      width: 100,
      align: 'center',
    },
    { title: '自清洁时间', dataIndex: 'clean1', hideInSearch: true, width: 100, align: 'center' },
    {
      title: '电量',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '总表',
          dataIndex: 'meter1Volume',
          align: 'center',
        },
        {
          title: '分表',
          dataIndex: 'meter2Volume',
          align: 'center',
        },
      ],
    },
    { title: '电表读数', dataIndex: 'meter2', hideInSearch: true, align: 'center' },
  ];

  return (
    <Layout className="right_layout_content">
      <CommonProTable
        columns={columns}
        searchParams={{ name: 'queryDate', value: ['queryDateFrom', 'queryDateTo'] }}
        fetchRequest={getHistoryStatusList}
        scroll={{ x: 1400 }}
        headerTitle="按日统计运行数据查询"
        manualRequest={true}
        setSearchParams={setSearchParams}
        search={{
          defaultCollapsed: false,
          optionRender: (_, formProps: any, dom: any) => {
            return [
              ...dom,
              <Button type="primary" onClick={downLoad} key={dom}>
                导出
              </Button>,
            ];
          },
        }}
      />
    </Layout>
  );
};

export default HistoryStatus;
