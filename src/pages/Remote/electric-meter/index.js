import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Table, Select, message, Input } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { meterParameter, saveMeterParameter } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";

const { Item } = Descriptions;
const { Meta } = Card;

const ElectricMeter = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [primaryMeter, setPrimaryMeter] = useState(null);
  const [subMeter, setSubMeter] = useState(null);

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

  const getData = async (info) => {
    setLoading(true);
    const res = await meterParameter(info);
    if (res && res?.id) {
      setData(res);
      setDate(res.created)
      setPrimaryMeter(res["primary_meter"]);
      setSubMeter(res["sub_meter"]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
    return () => {
      setLoading(false);
      setDeviceInfo({});
    };
  }, []);

  const handleChangeSelect = (value) => {
    const info = stationOriginList.find(item => item?.id === value);
    setDeviceInfo({ deviceCode: info?.id, deviceName: info?.communicationCardNo })
  };

  const handleQuery = () => {
    if (deviceInfo?.deviceCode) {
      handleCancel();
      getData(deviceInfo);
    } else {
      message.error('请选择局站')
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const params = {
      "device_id": deviceInfo.deviceCode,
      "device_name": deviceInfo.deviceName,
      "primary_meter": primaryMeter,
      "sub_meter": subMeter
    };
    setLoading(true);
    const res = await saveMeterParameter(params);
    if (res && res?.id) {
      message.success('数据已下发！')
      setData(res);
      setDate(res.created)
    } else {
      message.error('数据下发失败')
    }
    setSubmitLoading(false);
    setEdit(false);
    setLoading(false);
  };

  const handleCancel = () => {
      setEdit(false);
  };

  const handleEdit = () => {
    setEdit(true);
    setPrimaryMeter(data["primary_meter"]);
    setSubMeter(data["sub_meter"]);
  };

  const handleChange = key => e => {
      const v = e.target.value;
      if (key === "sub_meter") {
          return setSubMeter(v);
      }

      if (key === "primary_meter") {
          return setPrimaryMeter(v);
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
        <Descriptions
          title="电表号"
          bordered
        >
            {
                ["primary_meter", "sub_meter"].map(key => {
                    const initVal = key === "sub_meter" ? data['sub_meter'] : data['primary_meter'];
                    const label = key === "sub_meter" ? "分电表" : "总电表";
                    return (
                        <Item key={key} label={label}>
                            {
                              edit ? (
                                    <Input key={key} defaultValue={initVal} onChange={handleChange(key)} />
                                ) : data[key]
                            }
                        </Item>

                    );
                })
            }
        </Descriptions>
        <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${date || ""}`} />
      </Card>
    </Layout>
  );
};

export default ElectricMeter;
