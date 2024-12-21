import React, { useState, useEffect } from 'react'; 
import { Button, Form, Input, Alert, Checkbox, Typography } from 'antd';
import axios from 'axios';

const URL_AUTH = "/api/auth/local";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ตรวจสอบ localStorage สำหรับการจำข้อมูล
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (storedRememberMe) {
      setUsername(storedUsername || '');
      setPassword(storedPassword || '');
      setRememberMe(storedRememberMe);
    }
  }, []);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, { ...formData });
      const token = response.data.jwt;
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` };

      // หากเลือก "Remember Me" ให้เก็บข้อมูลใน localStorage
      if (rememberMe) {
        localStorage.setItem('username', formData.identifier);
        localStorage.setItem('password', formData.password);
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('token', token); // เก็บ token ใน localStorage
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('token'); // ลบ token จาก localStorage
      }

      props.onLoginSuccess(token); // ส่ง token กลับไปที่ App.js
    } catch (err) {
      console.log(err);
      setErrMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Welcome Message */}
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Please Login
      </Typography.Title>

      <Form onFinish={handleLogin} autoComplete="off">
        {errMsg && (
          <Form.Item>
            <Alert message={errMsg} type="error" />
          </Form.Item>
        )}

        <Form.Item
          label="Username"
          name="identifier"
          rules={[{ required: true }]}
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
