import { Form, Input } from 'antd';

const ChangePassword = (props: any) => {
  const { form } = props;
  return (
    <div>
      <Form
        form={form}
        name="事件处理"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={{ remember: true, username: localStorage.getItem('userName') }}
        autoComplete="off"
      >
        <Form.Item label="用户名" name="username">
          <Input placeholder="请输入处理人" allowClear={true} disabled={true} />
        </Form.Item>
        <Form.Item
          label="当前密码"
          name="currentPassword"
          rules={[{ required: true, message: '请输入当前密码!' }]}
        >
          <Input.Password placeholder="请输入当前密码" allowClear={true} />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[{ required: true, message: '请输入新密码!' }]}
          hasFeedback
        >
          <Input.Password placeholder="请输入新密码" allowClear={true} />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          hasFeedback
          dependencies={['password']}
          rules={[
            { required: true, message: '确认密码不能为空!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码输入不一致！'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请输入确认密码" allowClear={true} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
