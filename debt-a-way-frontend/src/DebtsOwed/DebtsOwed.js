import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './DebtsOwed.css'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar';

// const token = localStorage.getItem('userToken');
  
// const decodedToken = jwtDecode(token);
// const userId = decodedToken._id;

const DebtsOwed = () => {
  const [debtsOwedByUser, setDebtsOwedByUsers] = useState([]);
  const [debtsHistory, setDebtsHistory] = useState([]);

  const token = localStorage.getItem('userToken');
  const decodedToken = jwtDecode(token);
    const userId = decodedToken._id;

  useEffect(() => {
    fetchDebtsOwed();
    fetchOwedHistory();
  }, []);

  const fetchDebtsOwed = async () => {
    try {
      const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-owed-by/${userId}`);
      setDebtsOwedByUsers(response.data);
    } catch (error) {
      console.error('Error fetching debts owed:', error);
    }
  };

  const fetchOwedHistory=async()=>{
    try {
        const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-history/${userId}`);
        setDebtsHistory(response.data.filter(debt => debt.borrower._id === userId)); // Filter the debts where user is the borrower
        //setDebtsHistory(response.data); // Set the full history
      } catch (error) {
        console.error('Error fetching debts owed:', error);
      }
  }

  const handlePayDebt = async (debtId) => {
    try {
      // Make an API call to mark the debt as paid or initiate the payment process
      const response = await axios.patch(`https://debt-a-way.onrender.com/api/debt-postings/pay/${debtId}`)

  
      const updatedDebtInfo = response.data.debtPosting;
      const updatedUser = response.data.user;
      
      // Refresh the list of debts owed by the user
      fetchDebtsOwed();
    } catch (error) {
      console.error('Error paying debt:', error);
    }
  };

  return (
    <div>
      <Navbar />
    <div className='Debts-Owed'>
       <div className="full-width-container">
       <h3 className="debts-owed-heading">Debts Owed by Me</h3>
       {debtsOwedByUser.length > 0 ? (
            <table className="dod-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {debtsOwedByUser.map(debt => (
                        <tr key={debt._id}>
                            <td>{debt.lender.username}</td> {/* Adjust as per your data structure */}
                            <td className="value">${debt.amount}</td>
                            <td>{debt.interestRate}%</td>
                            <td>
                              <button className="pay-button" onClick={() => handlePayDebt(debt._id)}>Pay</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       ) : ( <p className='default-debt-text'>You don't owe any debts.</p>
       )}
        </div>

        <div className="full-width-container">

            <h3 className="debts-owed-heading">Debts Owed History</h3>
            {debtsHistory.length > 0 ? (
            <table className="dod-table">
                <thead>
                    <tr>
                        <th>Lender</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {debtsHistory.map(debt => (
                        <tr key={debt._id}>
                            <td>{debt.lender.username}</td> {/* Adjust as per your data structure */}
                            <td className="value">${debt.amount}</td>
                            <td>{debt.interestRate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : ( <p className='default-debt-text'>No debt history available yet.</p>
       )}
        </div>
    </div>
      <Footer/>
  </div>
  );
};

export default DebtsOwed;
