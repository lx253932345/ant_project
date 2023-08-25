import { Button, Select } from "antd";

// 设备选择
const DeviceSelect = props => {
  const { placeholder = '', dataList = [], disabled = false, loading = false, onClick, onChange } = props;
  return <div>
    <Select
      onChange={onChange}
      style={{ width: 250, margin: '0px 10px' }}
      placeholder={placeholder}
      allowClear={true}
      showSearch
      filterOption={
          (input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
    {
        dataList.map((item, index) => {
            return (
                <Select.Option key={index} value={item?.value}>{item?.label}</Select.Option>
            );
        })
    }
    </Select>
    <Button disabled={disabled} loading={loading} onClick={onClick} type="primary">查询</Button>
  </div>
}

export default DeviceSelect;
