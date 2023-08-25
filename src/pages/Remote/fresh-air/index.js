import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Table, Select, message, Input } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { fanParameters, saveFanParameters } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";
import { autoModeFreshAirConfig } from "../remoteTables";

const { Item } = Form;
const { Meta } = Card;

const FreshAir = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [edit, setEdit] = useState(false);
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

  const getData = async (info) => {
    setLoading(true);
    const res = await fanParameters(info);
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

  const handleFinish = async (values) => {
    setSubmitLoading(true);
    const params = {
      device_id: deviceInfo.deviceCode,
      device_name: deviceInfo.deviceName,
      ...values
    };
    setLoading(true);
    const res = await saveFanParameters(params);
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

  const setFormValues = () => {
    form.setFieldsValue(data);
  };

  const handleEdit = val => () => {
    val && setFormValues();
    setEdit(val);
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    form.submit();
  };

  return (
    <Layout className="right_layout_content">
      <Form
        name='warningSetting'
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
            disabled={loading || !Object.keys(data).length}
            loading={submitLoading}
            edit={edit}
            onSubmit={handleSubmit}
            onEdit={handleEdit(true)}
            onCancel={handleEdit(false)}
          />
        </Card>
        <Card style={{ margin: "16px 0px", padding: 24 }}>
          <Descriptions
              bordered
              column={2}
          >
              {
                  Object.entries(autoModeFreshAirConfig).map(([key, val]) => {
                      return (
                          <Descriptions.Item key={key} label={val}>
                              {
                                  edit ? (
                                      <Item
                                          name={key}
                                          noStyle
                                      >
                                          <Input defaultValue={data[key]} disabled={submitLoading} />
                                      </Item>
                                  ) : (
                                      data[key]
                                  )
                              }
                          </Descriptions.Item>
                      );
                  })
              }
          </Descriptions>
          <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${date || ""}`} />
        </Card>
      </Form>
    </Layout>
  );
};

export default FreshAir;
