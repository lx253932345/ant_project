import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { Fragment, useEffect, useRef } from 'react';

const EchartsComponent = (props: any) => {
  const actionRef = useRef<any>();
  const { data = [], series = [], yAxis = [], xName = '', xFormat = '', isLoadComplete } = props;

  const getXData = () => {
    return data.map((item: any) => {
      const field = dayjs(item[xName]).format(xFormat);
      return field;
    });
  };

  const getYData = () => {
    return series.map((item: any) => {
      const list = data.map((ele: any) => {
        return ele[item.field];
      });
      return { ...item, data: list };
    });
  };

  const getLegend = () => {
    return series.map((item: any) => {
      return item.name;
    });
  };

  useEffect(() => {
    // console.log('actionRef', actionRef);
    if (isLoadComplete) {
      isLoadComplete(true);
    }
    if (actionRef.current) {
      const myChart = echarts.init(actionRef.current);
      // console.log('myChart', actionRef.current);
      // 绘制图表
      myChart.setOption({
        legend: {
          data: getLegend(),
          bottom: 0,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: getXData(),
          axisTick: {
            alignWithLabel: true,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          // bottom: '3%',
          containLabel: true,
        },
        yAxis: yAxis && yAxis.length ? yAxis : {},
        series: getYData(),
      });
    }
  }, []);

  return (
    <Fragment>{data.length ? <div ref={actionRef} style={{ width: '100%', height: 400 }}></div> : null}</Fragment>
  );
};

export default EchartsComponent;
