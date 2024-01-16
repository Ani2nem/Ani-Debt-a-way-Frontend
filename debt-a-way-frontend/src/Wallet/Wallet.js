import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Wallet.css'
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';


const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [debtsOwed, setDebtsOwed] = useState(0);
  const [debtsReceivable, setDebtsReceivable] = useState(0);
  const [addAmount, setAddAmount] = useState('');

  const token = localStorage.getItem('userToken');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;

  useEffect(() => {
    fetchWalletBalance();
    fetchDebtsOwed();
    fetchDebtsReceivable();
    fetchTransactions(); // Fetch wallet balance and transactions
  }, []);

  const fetchWalletBalance = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/users/wallet-balance/${userId}`);
    setBalance(response.data.walletBalance); // Update based on actual response structure
  };

  const fetchDebtsOwed = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-owed-by/${userId}`);
    const totalOwed = response.data.reduce((acc, debt) => acc + debt.amount, 0);
    setDebtsOwed(totalOwed); // Update based on actual response structure
  };

  const fetchDebtsReceivable = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-owed-to/${userId}`);
    const totalReceivable = response.data.reduce((acc, debt) => acc + debt.amount, 0);
    setDebtsReceivable(totalReceivable); // Update based on actual response structure
  };


  const handleAddToWallet = async () => {
    try {
      const response = await axios.patch(`https://debt-a-way.onrender.com/api/users/update-wallet/${userId}`, {
        amount: addAmount
      });
  
      setBalance(response.data.walletBalance); // Update the state with the new wallet balance
      setAddAmount(''); // Reset the add amount field
    } catch (error) {
      console.error('Error adding money to wallet:', error);
    }
  };

  

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/transaction-logs');
  
      const formattedTransactions = response.data.map(log => {
        let direction, otherParty, transactionType;
  
        const isUserInitiator = log.userId._id === userId;
  
        if (log.type === 'add') {
          transactionType = 'Add';
          direction = 'credit';
          otherParty = 'N/A';
        } else {
          direction = isUserInitiator ? 'debit' : 'credit';
          otherParty = isUserInitiator && log.otherId ? log.otherId.username : log.userId.username;
  
          // Mapping transaction types based on context
          switch (log.type) {
            case 'lend':
              transactionType = isUserInitiator ? 'Lend' : 'Borrow';
              break;
            case 'pay':
              transactionType = isUserInitiator ? 'Pay' : 'Lend-Payback';
              break;
            case 'debt-buy':
              transactionType = isUserInitiator ? 'Debt-Buy' : 'Debt-Sell';
              break;
            default:
              transactionType = log.type.charAt(0).toUpperCase() + log.type.slice(1); // Capitalize the first letter
          }
        }
  
        return {
          ...log,
          direction,
          otherParty,
          type: transactionType
        };
      });
  
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const navigate = useNavigate();

  const navWallet = () => {
    navigate('/wallet');
  };

  const navOwed = () => {
    navigate('/debts-owed');
  };

  const navReceivable = () => {
    navigate('/debts-receivable');
  };

  return (
   
    <div>
      <Navbar />
      <div className='wallet-section'>
        <div  className="tiles-container">
        <div  className="tile" onClick={navWallet}>
        < div className="tile-title">Wallet Balance</div>
            <div className="tile-number">${balance}</div>
        </div>
        <div  className="tile" onClick={navOwed}>
            <div className="tile-title">Debts Owed</div>
            <div className="tile-number">${debtsOwed}</div> 
        </div>
        <div  className="tile"  onClick={navReceivable}>
            <div className="tile-title">Debts Receivable</div>
            <div className="tile-number"> ${debtsReceivable}</div> 
        </div>
     </ div>

        <div  className="add-to-wallet-container">
        <h3>Add Money to Wallet</h3>
        <input 
            type="number" 
            value={addAmount} 
            onChange={(e) => setAddAmount(e.target.value)} 
            placeholder="Enter amount" 
        />
        <button onClick={handleAddToWallet}>Add to Wallet</button>
        </div>


      <div className="transaction-logs-container">
        <h3>Transaction Logs</h3>
        {transactions.length > 0 ? (
        <table className='transaction-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Direction</th>
              <th>Amount</th>
              <th>Other Party</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.type}</td>
                <td className={transaction.direction === 'credit' ? 'credit-amount' : 'debit-amount'}>
                  {transaction.direction}
                </td>
                <td>${transaction.amount}</td>
                <td>{transaction.otherParty}</td>
              </tr>
            ))}
          </tbody>
        </table>
         ) : (
          <p className='default-debt-text'>No Transaction History available.</p>
        )}  
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wallet;
