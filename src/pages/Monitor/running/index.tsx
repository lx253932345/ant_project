import EchartsComponent from '@/components/Echarts';
import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { getRunningStatusList, getStationList } from '@/services/monitor';
import { Card, DatePicker, Layout, Select, Skeleton, Spin } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

/**
 * 每日分时运行数据
 * @param props
 * @returns
 */
const RunningStatus = () => {
  const [stationList, setStationList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const columns = [
    {
      title: '时间',
      dataIndex: 'queryDate',
      valueType: 'date',
      initialValue: dayjs().subtract(1, 'day'),
      align: 'center',
      width: 150,
      renderFormItem: () => {
        return <DatePicker disabledDate={disabledDate} allowClear={true} />;
      },
      render: (_, record: any) => {
        return <span>{record?.created}</span>;
      },
    },
    {
      title: '局站名称',
      width: 150,
      align: 'center',
      dataIndex: 'deviceCode',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
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
      render: (_, record: any) => {
        return <span>{record?.deviceObject?.name || '-'}</span>;
      },
    },
    {
      title: '运行时间 (min)',
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
      title: '温度 (°C)',
      dataIndex: 'created_at',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '室外温度',
          dataIndex: 'outTemp',
          align: 'center',
        },
        {
          title: '室内温度',
          dataIndex: 'inTemp1',
          align: 'center',
        },
      ],
    },
    {
      title: '电表读数 (kw.h)',
      hideInSearch: true,
      align: 'center',
      children: [
        {
          title: '总路',
          dataIndex: 'meter1',
          align: 'center',
        },
        {
          title: '分路',
          dataIndex: 'meter2',
          align: 'center',
        },
      ],
    },
  ];

  return (
    <Layout className="right_layout_content">
      <Spin spinning={loading}>
        <CommonProTable
          columns={columns}
          searchParams={{ name: 'page', value: ['page', 'size'], type: 'delete' }}
          fetchRequest={getRunningStatusList}
          headerTitle="每日运行数据查询"
          manualRequest={true}
          tableExtraRender={(tableProps: any) => {
            return (
              <Card className=''>
                {tableProps.action.loading ? (
                  <Skeleton />
                ) : (
                  <EchartsComponent
                    data={tableProps.action.dataSource}
                    xName="created"
                    xFormat="HH:mm"
                    series={[
                      { name: '空调', type: 'bar', field: 'airTime', stack: 'total' },
                      { name: '风机', type: 'bar', field: 'fanTime', stack: 'total' },
                    ]}
                    isLoadComplete={(status: boolean) => {
                      setLoading(!status)
                    }}
                  />
                )}
              </Card>
            );
          }}
          form={{
            ignoreRules: false,
          }}
          search={{
            defaultCollapsed: false,
            optionRender: (searchConfig, formProps, dom) => {
              const newDom = dom.slice(1);
              return [...newDom];
            },
          }}
        />
        </Spin>
    </Layout>
  );
};

export default RunningStatus;
