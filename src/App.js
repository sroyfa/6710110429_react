import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import LoginScreen from "./LoginScreen";
import FinanceScreen from "./FinanceScreen";

// Axios default base URL
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      action_datetime: "2024-12-20T10:30:00",
      type: "income",
      amount: 5000,
      note: "Salary",
    },
    {
      id: 2,
      action_datetime: "2024-12-21T14:00:00",
      type: "expense",
      amount: 1500,
      note: "Groceries",
    },
  ]);

  // Check if user is authenticated by checking if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  // Callback for successful login
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token); // Store token in localStorage
    axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
    setIsAuthenticated(true);
  };

  // Callback for logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    axios.defaults.headers.common["Authorization"] = ""; // Clear axios header
    setIsAuthenticated(false);
  };

  // Callback functions for TransactionList
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditTransaction = (record) => {
    console.log("Editing transaction:", record);
    // Add logic for editing the transaction (e.g., opening a modal)
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Welcome Message */}
        {!isAuthenticated && (
          <div className="welcome-box">
            <h1>
              <span role="img" aria-label="heart">
                ❤️
              </span>
              <span role="img" aria-label="star">
                ⭐
              </span>
              Welcome to the App{" "}
              <span role="img" aria-label="star">
                ⭐
              </span>
              <span role="img" aria-label="heart">
                ❤️
              </span>
            </h1>
          </div>
        )}


        {/* Show LoginScreen or FinanceScreen based on authentication status */}
        {!isAuthenticated && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
        
        {isAuthenticated && (
          <div>
            <FinanceScreen
              onLogout={handleLogout}
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleEditTransaction}
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;









