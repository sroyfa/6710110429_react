import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const { Option } = Select;

export default function EditItem({ isOpen, onClose, item, onItemEdited }) {
  const [form] = Form.useForm();

  // ใช้ useEffect เพื่อตั้งค่าเริ่มต้นใน Form เมื่อ Modal เปิด
  useEffect(() => {
    if (isOpen && item) {
      form.setFieldsValue(item);
    }
  }, [isOpen, item, form]);

  // ฟังก์ชันที่เรียกเมื่อกดปุ่ม OK
  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((formData) => {
        onItemEdited(formData); // ส่งข้อมูลที่แก้ไขกลับไป
        onClose(); // ปิด Modal
      })
      .catch((err) => {
        console.error("Validation failed:", err);
      });
  };

  return (
    <Modal
      title="Edit Transaction"
      open={isOpen}
      onOk={handleFormSubmit} // ผูก Event เมื่อกดปุ่ม OK
      onCancel={onClose} // ปิด Modal เมื่อกด Cancel
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select the type" }]}
        >
          <Select placeholder="Select type">
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: "Please input the amount" },
            { type: "number", min: 1, message: "Amount must be greater than 0" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Enter amount" />
        </Form.Item>

        <Form.Item
          name="note"
          label="Note"
          rules={[{ required: true, message: "Please input a note" }]}
        >
          <Input placeholder="Enter note" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
