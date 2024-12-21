import { Button, Form, Select, Input, InputNumber } from 'antd';
import React from 'react';

export default function AddItem(props) {
  return (
    <Form layout="inline" onFinish={props.onItemAdded}>
      {/* เลือกชนิด (รายรับ/รายจ่าย) */}
      <Form.Item
        name="type"
        label="ชนิด"
        rules={[{ required: true, message: 'กรุณาเลือกชนิด' }]} // แสดงข้อความเมื่อไม่ได้เลือก
      >
        <Select
          allowClear
          style={{ width: "100px" }}
          options={[
            { value: 'income', label: 'รายรับ' },
            { value: 'expense', label: 'รายจ่าย' },
          ]}
        />
      </Form.Item>

      {/* ระบุจำนวนเงิน */}
      <Form.Item
        name="amount"
        label="จำนวนเงิน"
        rules={[{ required: true, message: 'กรุณากรอกจำนวนเงิน' }]} // แสดงข้อความเมื่อไม่ได้กรอก
      >
        <InputNumber
          placeholder="จำนวนเงิน"
          min={0} // ป้องกันค่าติดลบ
          style={{ width: "150px" }}
        />
      </Form.Item>

      {/* เพิ่มหมายเหตุ */}
      <Form.Item
        name="note"
        label="หมายเหตุ"
        rules={[{ required: true, message: 'กรุณากรอกหมายเหตุ' }]} // แสดงข้อความเมื่อไม่ได้กรอก
      >
        <Input placeholder="หมายเหตุ" style={{ width: "200px" }} />
      </Form.Item>
      
      {/* ปุ่มเพิ่ม */}
      <Form.Item>
        <Button type="primary" htmlType="submit">Add</Button>
      </Form.Item>
    </Form>
  );
}

