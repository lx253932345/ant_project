import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Table, Select, message, Input, Spin } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { runningCodeList, runningModeData, saveRunningModeData } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";
import { runningModeConfig } from "../remoteTables";
import Tools from "../../../utils/tools";

const { Item } = Descriptions;
const { Meta } = Card;

const RunningMode = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [runningCodeData, setRunningCode] = useState([]);
  const [runningMode, setRunningMode] = useState(null);
  const [frequency, setFrequency] = useState("");
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

  const getRunningCodeData = async () => {
    setLoading(true);
    const res = await runningCodeList();
    if (res && Array.isArray(res)) {
      setRunningCode(res)
    }
    setLoading(false);
  };

  const getData = async (info) => {
    setLoading(true);
    const res = await runningModeData(info);
    if (res && res?.name) {
      setData({ runningMode: res.name, frequency: res.frequency });
      setDate(res.created)
    }
    setLoading(false);
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
    getRunningCodeData();
    return () => {
      setLoading(false);
      setDeviceInfo({});
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

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const params = {
      device_id: deviceInfo.deviceCode,
      device_name: deviceInfo.deviceName,
      mode: +runningMode,
      frequency
    };
    setLoading(true);
    const res = await saveRunningModeData(params);
    if (res && res?.name) {
      message.success('数据已下发！')
      if (deviceInfo?.deviceCode) {
        getData(deviceInfo)
      }
    } else {
      setLoading(false);
      message.error('数据下发失败')
    }
    setSubmitLoading(false);
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const handleEdit = () => {
    setEdit(true);
    setRunningMode(Tools.findKeyByValue(data.runningMode, runningCodeData));
    setFrequency(data.frequency);
  };

  const handleChange = v => {
    setRunningMode(v);
  };

  const getEditNode = (key, defaultValue) => {
    if (key === "runningMode") {
        return (
            <Select
                style={{ width: "100%" }}
                defaultValue={defaultValue}
                value={runningMode}
                onChange={handleChange}
            >
                {
                    Object.entries(runningCodeData).map(([key, val]) => {
                        return (
                            <Select.Option key={key} value={val.code}>{val.name}</Select.Option>
                        );
                    })
                }
            </Select>
        );
    }

    if (key === "frequency") {
        return <Input defaultValue={defaultValue} value={frequency} onChange={e => setFrequency(e.target.value)} />;
    }
  };

  return (
    <Layout className="right_layout_content">
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
            disabled={loading || !Object.keys(data).length}
            loading={submitLoading}
            edit={edit}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        </Card>
        <Card style={{ margin: "16px 0px", padding: 24 }}>
          <Spin spinning={loading}>
            <Descriptions
                bordered
                column={1}
            >
                {
                    Object.entries(data).map(([key, val]) => {
                        return (
                            <Item style={{ width: "50%" }} key={key} label={runningModeConfig[key]}>
                                {
                                    edit ? getEditNode(key, val) : val
                                }
                            </Item>
                        );
                    })
                }
            </Descriptions>
          </Spin>
          <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${date || ""}`} />
        </Card>
    </Layout>
  );
};

export default RunningMode;
