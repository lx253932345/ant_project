import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Table, Select, message, Input, Spin } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { relayModeData, saveRelayModeData } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";
import { relayModeConfig, relayModeConfigData } from "../remoteTables";
import Tools from "../../../utils/tools";
import styles from './index.scss';

const { Item } = Descriptions;
const { Meta } = Card;

const RelayMode = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [originData, setOriginData] = useState({});
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
    const res = await relayModeData(info);
    if (res && res?.created) {
      setOriginData(res);
      const obj = {};
      for (let key in relayModeConfig) {
        const value = relayModeConfigData[key][res[key]]
        obj[key] = value;
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
    const res = await saveRelayModeData(params);
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
    return (
      <Select
          style={{ width: "100%" }}
          defaultValue={defaultValue}
      >
          {
              Object.entries(relayModeConfigData[key]).map(([k, val]) => {
                  return (
                      <Select.Option key={k} value={+k}>{val}</Select.Option>
                  );
              })
          }
      </Select>
    );
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
            <Form form={form}>
            <Descriptions
              bordered
              column={1}
              className={styles.desc}
            >
                {
                    Object.entries(data).map(([key, val]) => {
                        return (
                            <Item style={{ width: "50%" }} key={key} label={relayModeConfig[key]}>
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

export default RelayMode;
