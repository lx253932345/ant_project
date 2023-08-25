import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Row, message, Input, Spin, InputNumber, Switch } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { getAirParameter, setAirParameter, runningModeData, saveRunningModeData } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";
import { airParameterConfig } from "../remoteTables";
import Tools from "../../../utils/tools";
import styles from './index.scss';

const { Item } = Descriptions;
const { Meta } = Card;

const AirParameter = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [originData, setOriginData] = useState({});
  // 开关
  const [airSwitch, setAirSwitch] = useState(false);
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

  const getData = async (info) => {
    setLoading(true);
    const res = await getAirParameter(info);
    if (res && res?.created) {
      setOriginData(res);
      const obj = {};
      for (let key in airParameterConfig) {
        obj[key] = res[key];
      }
      form.setFieldValue(obj)
      setData(obj);
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
      setOriginData({});
      setDate('')
      form.resetFields();
    };
  }, []);

  // 运行模式的状态
  const getRunMode = async (info) => {
    const res = await runningModeData(info);
    if (res && res?.code) {
      setAirSwitch(res?.code == 1)
    }
  }

  const handleChangeSelect = (value) => {
    const info = stationOriginList.find(item => item?.id === value);
    setDeviceInfo({ deviceCode: info?.id, deviceName: info?.communicationCardNo })
  };

  const handleQuery = () => {
    if (deviceInfo?.deviceCode) {
      handleCancel();
      getData(deviceInfo)
      getRunMode(deviceInfo)
    } else {
      message.error('请选择局站')
    }
  };

  const handleSubmit = async () => {
    const formValue = form.getFieldsValue();
    const currValue = Tools.filterUnUseField(formValue)
    const params = {
      deviceId: deviceInfo.deviceCode,
      deviceName: deviceInfo.deviceName,
      ...originData,
      ...currValue
    };
    // console.log('formValue', params, originData);
    setLoading(true);
    const res = await setAirParameter(params);
    if (res && res?.created) {
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
  };

  const getEditNode = (key, defaultValue) => {
    const maxCount = key === 'airTemp' ? 2000 : 999;
    return (
      <InputNumber style={{ width: "100%" }} max={maxCount} min={0} defaultValue={+defaultValue}></InputNumber>
    );
  };

  const onChangeSwitch = value => {
    setAirSwitch(value);
    const params = {
      device_id: deviceInfo.deviceCode,
      device_name: deviceInfo.deviceName,
      mode: value ? 1 : 0,
      frequency: '10'
    };
    saveAirMode(params)
  }

  const saveAirMode = async (params) => {
    setLoading(true);
    const res = await saveRunningModeData(params);
    if (res && res?.name) {
      message.success('空调模式已修改！')
    } else {
      setLoading(false);
      message.error('数据操作失败')
    }
    getData(deviceInfo)
    setSubmitLoading(false);
    setEdit(false);
  }

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
          {
            data && Object.keys(data).length ? <Row align={"middle"} justify={'space-between'} className={styles.row_switch}>
              <div>空调开关：<Switch defaultChecked={airSwitch} loading={loading} onChange={onChangeSwitch} /></div>
            </Row> : null
          }
        </Card>
        <Card style={{ margin: "16px 0px", padding: 24 }}>
          <Spin spinning={loading}>
            <Form form={form}>
            <Descriptions
              bordered
              column={1}
              className={styles.desc}
            >
                {
                    Object.entries(data).map(([key, val]) => {
                        return (
                            <Item style={{ width: "50%" }} key={key} label={airParameterConfig[key]}>
                              <Form.Item name={key}>{edit ? getEditNode(key, val) : val}</Form.Item>
                            </Item>
                        );
                    })
                }
            </Descriptions>
            </Form>
          </Spin>
          <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${date || ""}`} />
        </Card>
    </Layout>
  );
};

export default AirParameter;
