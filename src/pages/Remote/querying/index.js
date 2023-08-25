import React, { useEffect, useState } from "react";
import { message, Descriptions, Card, Layout } from "antd";
import { getStationList } from '@/services/monitor';
import { queryingRealtimeCols } from "./queryingTables";
import DeviceSelect from "@/components/DeviceSelect";
import { getProjectData } from '@/services/remote';
import Tools from "../../../utils/tools";

const { Item } = Descriptions;
const { Meta } = Card;

const Realtime = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [stationOriginList, setOriginStationList] = useState([]);

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

  const formatData = (data = {}) => {
    return {
        ...data,
        mode: data.mode?.name,
        airStatus:data.airStatus? "开启":"关闭",
        fanStatus:data.fanStatus? "开启":"关闭",
        valveStatus:data.valveStatus? "开启":"关闭",
        altDate: Tools.getAltDateDesc(+data.altDate),
    };
  };

  const getData = async (info) => {
    setLoading(true);
    const res = await getProjectData(info);
    if (res && res?.deviceObject) {
      setData(formatData(res));
    }
    setLoading(false);
  };

  useEffect(() => {
    // 获取局站列表
    getStationData();
    return () => {
      setLoading(false);
      setDeviceInfo({})
    };
  }, []);

  const handleChangeSelect = (value) => {
    const info = stationOriginList.find(item => item?.id === value);
    setDeviceInfo({ deviceCode: info?.id, deviceName: info?.communicationCardNo })
  };

  const handleQuery = () => {
    if (deviceInfo?.deviceCode) {
      getData(deviceInfo)
    } else {
      message.error('请选择局站')
    }
  };

  return (
    <Layout className="right_layout_content">
      <Card style={{ padding: 24 }}>
        <DeviceSelect
          onChange={handleChangeSelect}
          onClick={handleQuery}
          loading={loading}
          dataList={stationList}
          placeholder="请选择局站"
        />
      </Card>
      <Card style={{ margin: "16px 0px", padding: 24 }} loading={loading}>
        <Descriptions column={2} title="实时状态" bordered>
            {
                Object.keys(queryingRealtimeCols).map(key => {
                    return (
                        <Item key={key} label={queryingRealtimeCols[key]}>
                            {data[key]}
                        </Item>
                    );
                })
            }
        </Descriptions>
        <Meta style={{ marginTop: 4, textAlign: "right" }} description={`数据更新时间：${data.created || ""}`} />
      </Card>
    </Layout>
  );
};

export default Realtime;
