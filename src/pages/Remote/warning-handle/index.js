import React, { useEffect, useState } from "react";
import { message, Descriptions, Card, Layout, Form, Table, Select } from "antd";
import { getStationList } from '@/services/monitor';
import { warningHandleTableConfig } from "../remoteTables";
import DeviceSelect from "@/components/DeviceSelect";
import { warningProcessCode, processParameters, saveProcessParameters } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";

const { Item } = Form;
const { Meta } = Card;

const WarningHandle = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [warnCodeList, setWarnCodeList] = useState([]);
  const [date, setDate] = useState('');
  const [form] = Form.useForm();

  const getStationData = async () => {
    const res = await getStationList({ page: 0, size: 500 });
    if (res && res?.content && Array.isArray(res?.content)) {
      setOriginStationList(res?.content || [])
      const list = res?.content.map((item) => {
        return { label: item.name, value: item.id };
      });
      setStationList(list);
    }
  };

  const getWarnData = async (info) => {
    const res = await warningProcessCode();
    if (res && Array.isArray(res)) {
      const currData = formatWarnData(res, "code");
      setWarnCodeList(currData);
    }
  };

  const formatData = (data = { results: [] }) => {
    const tableData = data.results.map((item, idx) => ({
      warnCode: item["warnCode"]["code"],
      warnName: item["warnCode"]["name"],
      processCode: item["processCode"]["code"],
      processName: item["processCode"]["name"],
      key: idx
    }));
    return {
      data: tableData,
      created: data.created
    };
  };

  const formatWarnData = (data = [], key = "code") => {
    const res = {};
    data.forEach(item => {
        res[item[key]] = item["name"];
    });
    return res;
  };

  const getData = async (info) => {
    setLoading(true);
    const res = await processParameters(info);
    if (res && res?.results) {
      const currData = formatData(res);
      setData(currData.data);
      setDate(currData.created)
    }
    setLoading(false);
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
    // 告警列表
    getWarnData();
    return () => {
      setLoading(false);
      setDeviceInfo({});
      setWarnCodeList([]);
      form.resetFields();
    };
  }, []);

  const handleChangeSelect = (value) => {
    const info = stationOriginList.find(item => item?.id === value);
    setDeviceInfo({ deviceCode: info?.id, deviceName: info?.communicationCardNo })
  };

  const handleQuery = () => {
    if (deviceInfo?.deviceCode) {
      handleCancel();
      getData(deviceInfo)
    } else {
      message.error('请选择局站')
    }
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    form.submit();
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const handleEdit = () => {
    setEdit(true);
    const obj = data.map(item => item.processCode.toString());
    form.setFieldsValue(data.map(item => item.processCode.toString()));
  };

  const handleFinish = async values => {
    const params = {
      device_id: deviceInfo.deviceCode,
      process_value: Object.values(values),
      device_name: deviceInfo.deviceName
    };
    setLoading(true);
    const res = await saveProcessParameters(params);
    if (res && res?.results) {
      message.success('数据已下发！')
      const currData = formatData(res);
      setData(currData.data);
      setDate(currData.created)
    } else {
      message.error('数据下发失败')
    }
    setSubmitLoading(false);
    setEdit(false);
    setLoading(false);
  };

  const cols = Object.entries(warningHandleTableConfig).map(([key, val], index) => {
    let render = null;
    if (key === "processName") {
        render = edit ? (
            (text, record, idx) => {
                const defaultValue = record?.processCode.toString();
                return (
                    <Item name={idx} noStyle>
                        <Select disabled={submitLoading} defaultValue={defaultValue} style={{ width: "100%" }}>
                            {
                                Object.entries(warnCodeList).map(([key, val]) => {
                                    return (
                                        <Select.Option key={key} val={key}>{val}</Select.Option>
                                    );
                                })
                            }
                        </Select>
                    </Item>
                );
            }
        ) : null;
    }


    return {
        dataIndex: key,
        title: val,
        width: "50%",
        render,
    };
  });

  return (
    <Layout className="right_layout_content">
      <Form
        name="warningHandle"
        onFinish={handleFinish}
        form={form}
      >
        <Card style={{ display: "flex", padding: 24 }}>
          <DeviceSelect
            onChange={handleChangeSelect}
            onClick={handleQuery}
            loading={loading}
            disabled={submitLoading}
            dataList={stationList}
            placeholder="请选择局站"
          />
          <IssuedButtons
            disabled={loading || !data.length}
            loading={submitLoading}
            edit={edit}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        </Card>
        <Card style={{ margin: "16px 0px", padding: 24 }}>
          <Table
            rowClassName="table-row"
            style={{ margin: "0px 12px" }}
            dataSource={data}
            bordered
            columns={cols}
            pagination={false}
          />
          <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${date || ""}`} />
        </Card>
      </Form>
    </Layout>
  );
};

export default WarningHandle;
