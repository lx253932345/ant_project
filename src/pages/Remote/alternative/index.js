import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Table, Select, message, Input, Cascader } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { alternativeParameters, saveAlternativeParameters } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";
import { alternativeAltDateOptions, alternativeCols } from "../remoteTables";

const { Item } = Descriptions;
const { Meta } = Card;

const AlterNative = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [form] = Form.useForm();
  const [altTime, setAltTime] = useState(null);
  const [altDate, setAltDate] = useState(null);
  const [altDay, setAltDay] = useState(null);

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
    const res = await alternativeParameters(info);
    if (res && res?.id) {
      setData(res);
      setDate(res.created)
    }
    setLoading(false);
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
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
      "device_id": deviceInfo?.deviceCode,
      "device_name": deviceInfo?.deviceName,
      "alt_date": altDate,
      "alt_time": altTime,
      "alt_day": altDay
    };
    setLoading(true);
    const res = await saveAlternativeParameters(params);
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

  const handleEdit = () => {
    setEdit(true);
    setAltDate(data["alt_date"]);
    setAltTime(data["alt_time"]);
    setAltDay(data["alt_day"]);
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const getDateType = val => {
    if (val >= 1 && val <= 25) {
        return "type-1"; //日期
    }

    if (val === 32 || val === 33) {
        return "type-2"; //单双号
    }

    if (val >= 48 && val <= 54) {
        return "type-3"; //星期
    }

    if (val === 0) {
        return "type-4"; // 不轮替
    }
  };

  const getInputNode = key => {
    switch (key) {
        case "alt_date":
            return (
                <Cascader
                    value={[getDateType(altDate), altDate]}
                    style={{ width: "100%" }}
                    options={alternativeAltDateOptions}
                    expandTrigger="hover"
                    displayRender={label => label[label.length - 1]}
                    onChange={v => setAltDate(v[1])}
                    disabled={submitLoading}
                />
            );
        case  "alt_time":
            return (
                <Select
                    style={{ width: "100%" }}
                    value={altTime}
                    onChange={v => setAltTime(v)}
                    disabled={submitLoading}
                >
                    {
                        [...Array(24)].map((item, idx) => {
                            return (
                                <Option key={idx} value={idx}>{idx}</Option>
                            );
                        })
                    }
                </Select>
            );
        case  "alt_day":
            return (
                <Select
                    style={{ width: "100%" }}
                    value={altDay}
                    onChange={v => setAltDay(v)}
                    disabled={submitLoading}
                >
                    {
                        [...Array(3)].map((item, idx) => {
                            const disabledAltDay = altDate > 25 && idx !== 0;
                            return (
                                <Option disabled={disabledAltDay} key={idx + 1} value={idx + 1}>{idx + 1}</Option>
                            );
                        })
                    }
                </Select>
            );
    }
  };

  const getTextByVal = val => {
    let res = null;
    alternativeAltDateOptions.forEach(item => {
        if (res) return;

        if (item.children.length) {
            item.children.forEach(child => {
                if (res) return;

                if (child.value === val) {
                    res = child.label;
                }
            });
        }
    });

    return res;
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
        <Descriptions column={4} layout="vertical" bordered>
            {
                Object.entries(alternativeCols).map(([key, val]) => {
                    return (
                        <Item label={val} key={key}>
                            {
                                edit ? (
                                    getInputNode(key)
                                ) : (
                                    key === "alt_date" ? (
                                        getTextByVal(data[key])
                                    ) : data[key]
                                )
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

export default AlterNative;
