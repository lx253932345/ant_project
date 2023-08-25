import { Form, Input, Select } from 'antd';

const { TextArea } = Input;

// 处理状态-编辑
const EditStatus = (props: any) => {
  const { handleStatusData = [], form } = props;

  return (
    <div>
      <Form
        form={form}
        name="事件处理"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        // style={{ width: 780 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="处理状态"
          name="processingCode"
          rules={[{ required: true, message: '处理状态不能为空!' }]}
        >
          <Select
            options={handleStatusData}
            placeholder="请选择处理状态"
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Form.Item>
        <Form.Item
          label="处理人"
          name="person"
          rules={[{ required: true, message: '处理人不能为空!' }]}
        >
          <Input placeholder="请输入处理人" allowClear={true} />
        </Form.Item>
        <Form.Item
          label="处理描述"
          name="desc"
          rules={[{ required: true, message: '处理描述不能为空!' }]}
        >
          <TextArea rows={4} placeholder="请输入处理描述" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditStatus;
