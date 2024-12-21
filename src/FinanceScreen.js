import React, { useState, useEffect } from 'react';
import { Button, Typography, Divider, Spin, Modal, Form, Input } from 'antd';
import TransactionList from "./components/TransactionList";
import AddItem from './components/AddItem';
import axios from 'axios';
import dayjs from 'dayjs';

const URL_TXACTIONS = '/api/txactions';

function FinanceScreen(props) {
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [summaryAmount, setSummaryAmount] = useState(0); // สำหรับคำนวณยอดรวม
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

  // Filter transactions based on selected type
  const filteredTransactions = transactionData.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

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
    setCurrentTransaction(record);
    setIsEditModalOpen(true);
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
      setIsEditModalOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    props.onLogout();
  };

  // Calculate summary amount
  useEffect(() => {
    setSummaryAmount(
      transactionData.reduce(
        (sum, transaction) =>
          transaction.type === 'income' ? sum + transaction.amount : sum - transaction.amount,
        0
      )
    );
  }, [transactionData]);

  // Fetch initial items
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="App-header" style={{ flex: 1 }}>
        <Spin spinning={isLoading}>
          <Typography.Title>
            จำนวนเงินปัจจุบัน {summaryAmount} บาท
          </Typography.Title>

          {/* Filter buttons */}
          <div style={{ marginBottom: '20px' }}>
            <Button onClick={() => setFilterType('all')} style={{ marginRight: '10px' }}>ทั้งหมด</Button>
            <Button onClick={() => setFilterType('income')} style={{ marginRight: '10px' }}>รายรับ</Button>
            <Button onClick={() => setFilterType('expense')}>รายจ่าย</Button>
          </div>

          <AddItem onItemAdded={handleAddItem} />
          <Divider>รายการธุรกรรม</Divider>

          <TransactionList
            data={filteredTransactions}
            onRowEdit={handleEditTransaction}
          />
        </Spin>
      </header>

      {/* Logout button */}
      <footer
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '400px',
          padding: '10px',
          zIndex: 10,
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






