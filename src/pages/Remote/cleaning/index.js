import React, { useEffect, useState } from "react";
import { Descriptions, Card, Layout, Form, Table, Select, message, Input, TimePicker, Checkbox } from "antd";
import { getStationList } from '@/services/monitor';
import DeviceSelect from "@/components/DeviceSelect";
import { selfCleaning, saveSelfCleaning } from '@/services/remote';
import IssuedButtons from "../../../components/IssuedButtons";
import { cleaningTimingCols, cleaningWeekdayConfig } from "../remoteTables";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";

const { Item } = Form;
const { Meta } = Card;

const Clearning = props => {
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
    const res = await selfCleaning(info);
    if (res && res?.id) {
      setData(formatData(res));
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

  const formatSubmitData = values => {
    const res = { "clean_times": [] };
    const timingKeys = ["valve_close_time", "clean_last", "clean_humid", "clean_warn_time"];
    Object.entries(values).forEach(([key, val]) => {
        if (timingKeys.includes(key)) {
            res[key] = val;
        } else {
            let arr = key.split("-");

            if (!res["clean_times"][arr[0]]) {
                res["clean_times"][arr[0]] = { "dayOfWeek": [] };
            }

            if (arr[1] === "time") {
                const [hour, minute, second] = moment(val).format("HH:mm:ss").split(":");

                res["clean_times"][arr[0]]["hour"] = hour;
                res["clean_times"][arr[0]]["minute"] = minute;
                res["clean_times"][arr[0]]["second"] = second;

            } else {
                res["clean_times"][arr[0]]["dayOfWeek"][arr[1]] = val;
            }

        }
    });
    return res;
  };

  const handleFinish = async (values) => {
    setSubmitLoading(true);
    const currData = formatSubmitData(values);
    const params = {
      device_id: deviceInfo.deviceCode,
      device_name: deviceInfo.deviceName,
      ...currData,
      valve_close_time: currData['valve_close_time'].toString()
    };
    setLoading(true);
    const res = await saveSelfCleaning(params);
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
    const { bookingData = {}, timingData = {} } = data;
    let obj = {};
    bookingData.forEach((item, index) => {
        for (let key in item) {
            if (item.hasOwnProperty(key)) {
                if (key === "key" || key === "title") {
                    continue;
                }

                if (key === "time") {
                    obj[`${index}-${key}`] = moment(item[key], "HH:mm");
                    continue;
                }

                obj[`${index}-${key}`] = item[key];
            }
        }
    });

    form.setFieldsValue({
        ...obj,
        ...timingData,
    });
  };

  const handleEdit = val => () => {
    val && setFormValues();
    setEdit(val);
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    form.submit();
  };

  const formatData = (data = {}) => {
    const arr = ["valve_close_time", "clean_last", "clean_humid", "clean_warn_time"];
    const bookingIdx = ["预约一", "预约二", "预约三", "预约四"];
    const timingData = {};
    const bookingData = [];
    arr.forEach(item => {
        timingData[item] = data[item];
    });

    data["clean_times"].forEach((item, idx) => {
        const obj = {};
        item["dayOfWeek"].forEach((day, index) => {
            obj[index] = day;
        });

        bookingData.push({
            ...obj,
            time: `${item.hour}:${item.minute < 10 ? "0" + item.minute : item.minute}`,
            key: idx,
            title: bookingIdx[idx]
        });
    });

    return {
        timingData,
        bookingData,
        created: data.created,
    };
  };

  const bookingCols = () => {
    const res = [{
        dataIndex: "title",
        title: "预约时间",
        width: "15%",
    }];
    Object.entries(cleaningWeekdayConfig).forEach(([key, title]) => {
        const render = edit ? (val, record, index) => (
            <Item valuePropName="checked" name={`${index}-${key}`} noStyle>
                <Checkbox disabled={submitLoading} defaultChecked={val}>{`${title}`}</Checkbox>
            </Item>
        ) : (
            val => val ? (
                <>
                    <CheckOutlined />
                </>
            ) : null
        );

        res.push({
            dataIndex: key,
            key,
            title,
            width: "10%",
            render,
        });
    });
    res.push({
        dataIndex: "time",
        key: "time",
        title: "开始时间",
        width: "15%",
        render: edit ? (
            (val, record, index) => {
                return <Item name={`${index}-time`} noStyle>
                    <TimePicker
                        disabled={submitLoading}
                        format="HH:mm"
                        defaultValue={dayjs(record?.time, 'HH:mm')}
                    />
                </Item>
            }
        ) : (
            val => (
                <span>{val}</span>
            )
        )
    });

    return res;
  };

  return (
    <Layout className="right_layout_content">
      <Form
        name='cleaning'
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
          <Descriptions loading={loading} column={4} layout="vertical" bordered>
              {
                  Object.entries(cleaningTimingCols).map(([key, title]) => {
                      return (
                          <Descriptions.Item label={title} key={key}>
                              {
                                edit ? <Item name={key} noStyle>
                                    <Input disabled={submitLoading} defaultValue={data?.timingData && data?.timingData[key]} />
                                </Item> : (data?.timingData && data?.timingData[key])
                              }
                          </Descriptions.Item>
                      );
                  })
              }
          </Descriptions>
          <Table
            rowClassName="table-row"
            loading={loading}
            style={{ marginTop: 16 }}
            dataSource={data?.bookingData || []}
            columns={bookingCols()}
            pagination={false}
            bordered
          />
          <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${date || ""}`} />
        </Card>
      </Form>
    </Layout>
  );
};

export default Clearning;
