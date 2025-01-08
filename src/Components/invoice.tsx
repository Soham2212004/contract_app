import React, { useState, useEffect } from "react";
import axios from "axios";
import "./invoice.css";

interface Contract {
  id: number;
  contract_name: string;
  start_date: string;
  end_date: string;
  total_points: number; 
  total_value: number;   
}

interface Point {
  id: number;
  contract_id: number;
  point: string;
  value: string;
}

const Invoice = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/contracts_with_points") 
      .then((response) => {
        console.log("Contracts data:", response.data);
        setContracts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching contracts:", error);
      });
  }, []);
  
  const fetchPoints = (contractId: number) => {
    axios
      .get(`http://localhost:5000/get_points/${contractId}`)
      .then((response) => {
        setPoints(response.data);
      })
      .catch((error) => {
        console.error("Error fetching points:", error);
      });
  };

  const handleContractClick = (contract: Contract) => {
    setSelectedContract(contract);
    fetchPoints(contract.id);
    setShowPopup(true);
  };

  return (
    <div className="invoice-page">
      <div className="header-container">
        <h2 className="invoice-title">Invoice</h2>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Contract Id</th>
            <th>Contract Name</th>
            <th>Total Points</th> 
            <th>Total Value</th>  
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} onClick={() => handleContractClick(contract)}>
              <td>{contract.id}</td>
              <td>{contract.contract_name}</td>
              <td>{contract.total_points}</td> 
              <td>{contract.total_value}</td>  
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && selectedContract && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Contract: {selectedContract.contract_name}</h2>
            <table className="points-table">
              <thead>
                <tr>
                  <th>Point</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.id}>
                    <td>{point.point}</td>
                    <td>{point.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="total-value">
              Total Value:{" "}
              {points.reduce((total, point) => total + parseFloat(point.value || "0"), 0)}
            </p>
            <button className="close-button" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;