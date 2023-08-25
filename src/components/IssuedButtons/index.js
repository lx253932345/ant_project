import { Button } from "antd";

const IssuedButtons = ({ edit, disabled, loading, onSubmit, onCancel, onEdit }) => {
  return edit ? (
    (
        <>
            <Button
                disabled={disabled}
                loading={loading}
                style={{ marginLeft: 12 }}
                type="primary"
                onClick={onSubmit}
            >
                下发
            </Button>
            <Button
                disabled={disabled || loading}
                type="link"
                onClick={onCancel}
            >
                取消
            </Button>
        </>
    )
  ) : (
      <Button
          disabled={disabled}
          style={{ marginLeft: 12 }}
          type="primary"
          onClick={onEdit}
      >
          修改
      </Button>
  )
}

export default IssuedButtons;
