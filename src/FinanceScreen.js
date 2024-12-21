import React, { useState, useEffect } from 'react';
import TransactionList from "./components/TransactionList";
import AddItem from './components/AddItem';
import { Modal, Form, Input, Spin, Typography, Divider, Button } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const URL_TXACTIONS = '/api/txactions';

function FinanceScreen(props) {
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Fetch items from server
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URL_TXACTIONS);
      setTransactionData(
        response.data.data.map(row => ({
          id: row.id,
          key: row.id,
          ...row.attributes,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new transaction
  const handleAddItem = async (item) => {
    try {
      setIsLoading(true);
      const params = { ...item, action_datetime: dayjs() };
      const response = await axios.post(URL_TXACTIONS, { data: params });
      const { id, attributes } = response.data.data;
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit transaction (open modal)
  const handleEditTransaction = (record) => {
    setCurrentTransaction(record); // Set current transaction for editing
    setIsEditModalOpen(true); // Open modal
  };

  // Save edited transaction
  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${URL_TXACTIONS}/${currentTransaction.id}`, {
        data: currentTransaction,
      });
      const { id, attributes } = response.data.data;

      setTransactionData((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? { id, key: id, ...attributes } : transaction
        )
      );
      setIsEditModalOpen(false); // Close modal
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete transaction
  const handleRowDeleted = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${URL_TXACTIONS}/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary amount
  useEffect(() => {
    setSummaryAmount(
      transactionData.reduce(
        (sum, transaction) =>
          transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount,
        0
      )
    );
  }, [transactionData]);

  // Fetch initial items
  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = () => {
    // เรียกฟังก์ชัน logout ที่ส่งจาก App.js
    props.onLogout();
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="App-header" style={{ flex: 1 }}>
        <Spin spinning={isLoading}>
          <Typography.Title>
            จำนวนเงินปัจจุบัน {summaryAmount} บาท
          </Typography.Title>

          <AddItem onItemAdded={handleAddItem} />
          <Divider>บันทึก รายรับ - รายจ่าย</Divider>
          <TransactionList
            data={transactionData}
            onRowEdit={handleEditTransaction}
            onRowDeleted={handleRowDeleted}
          />
        </Spin>
      </header>

      {/* ปุ่ม Logout อยู่ที่ด้านล่างและคงที่ */}
      <footer
        style={{
          position: 'fixed', // ทำให้ปุ่มอยู่ที่ตำแหน่งคงที่
          bottom: '20px', // กำหนดให้ปุ่มอยู่ห่างจากด้านล่าง 20px
          left: '50%', // ให้ปุ่มอยู่ตรงกลาง
          transform: 'translateX(-50%)', // ให้ปุ่มอยู่กลางแนวนอน
          width: '90%', // ให้ปุ่มมีความกว้างไม่เกิน 90% ของหน้าจอ
          maxWidth: '400px', // ตั้งขนาดสูงสุดของปุ่ม
          padding: '10px', // เพิ่มพื้นที่รอบๆ ปุ่ม
          zIndex: 10, // ตั้งค่า z-index เพื่อให้ปุ่มอยู่ด้านบนสุด
        }}
      >
        <Button onClick={handleLogout} type="primary" danger block>
          Logout
        </Button>
      </footer>

      {/* Modal for Editing Transaction */}
      <Modal
        title="Edit Transaction"
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleSaveEdit}
      >
        <Form layout="vertical">
          <Form.Item label="Note">
            <Input
              value={currentTransaction?.note}
              onChange={(e) =>
                setCurrentTransaction((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item label="Amount">
            <Input
              type="number"
              value={currentTransaction?.amount}
              onChange={(e) =>
                setCurrentTransaction((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FinanceScreen;




