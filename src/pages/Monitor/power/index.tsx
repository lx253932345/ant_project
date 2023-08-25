import downloadExcel from '@/components/DownLoad';
import EchartsComponent from '@/components/Echarts';
import CommonProTable from '@/components/ProTable';
import '@/global.less';
import { exportHistoryStatusList, getPowerList, getStationList } from '@/services/monitor';
import { Button, Card, DatePicker, Layout, Select, Skeleton, Spin, message } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

/**
 * 按日统计节能数据
 * @param props
 * @returns
 */
const PowerStatus = () => {
  const [stationList, setStationList] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const fileName = `export_${new Date().valueOf()}.xlsx`;
      downloadExcel(res, fileName);
    } else {
      message.warning('导出操作异常');
    }
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'queryDate',
      valueType: 'date',
      align: 'center',
      hideInTable: true,
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
      renderFormItem: () => {
        return <RangePicker disabledDate={disabledDate} allowClear={true} />;
      },
    },
    {
      title: '局站名称',
      align: 'center',
      dataIndex: 'deviceCode',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
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
    { title: '日期', dataIndex: 'created', hideInSearch: true, align: 'center', valueType: 'date' },
    { title: '总表电量', dataIndex: 'meter1Volume', hideInSearch: true, align: 'center' },
    { title: '分表电量', dataIndex: 'meter2Volume', hideInSearch: true, align: 'center' },
    { title: '室外温度', dataIndex: 'outTemp', hideInSearch: true, align: 'center' },
    { title: '室内温度', dataIndex: 'inTemp', hideInSearch: true, align: 'center' },
  ];

  return (
    <Layout className="right_layout_content">
      <Spin spinning={loading}>
        <CommonProTable
          columns={columns}
          searchParams={{
            name: 'page',
            value: ['page', 'size'],
            type: 'delete',
            replaceParams: { name: 'queryDate', value: ['queryDateFrom', 'queryDateTo'] },
          }}
          fetchRequest={getPowerList}
          headerTitle="节能统计数据查询"
          manualRequest={true}
          tableExtraRender={(tableProps: any) => {
            return (
              <Card>
                {tableProps.action.loading ? (
                  <Skeleton />
                ) : (
                  <EchartsComponent
                    data={tableProps.action.dataSource}
                    xName="created"
                    xFormat="YYYY-MM-DD"
                    yAxis={[
                      { type: 'value', name: '电量（度）' },
                      { type: 'value', name: '温度（摄氏度）' },
                    ]}
                    series={[
                      {
                        name: '总表电量',
                        type: 'line',
                        field: 'meter1Volume',
                        smooth: true,
                        yAxisIndex: 0,
                      },
                      {
                        name: '分表电量',
                        type: 'line',
                        field: 'meter2Volume',
                        smooth: true,
                        yAxisIndex: 1,
                      },
                      { name: '室外温度', type: 'line', field: 'outTemp', smooth: true },
                      { name: '室内温度', type: 'line', field: 'inTemp', smooth: true },
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
          setSearchParams={setSearchParams}
          search={{
            defaultCollapsed: false,
            optionRender: (searchConfig, formProps, dom) => {
              const newDom = dom.slice(1);
              return [
                ...newDom,
                <Button type="primary" onClick={downLoad} key={dom}>
                  导出
                </Button>,
              ];
            },
          }}
        />
      </Spin>
    </Layout>
  );
};

export default PowerStatus;
