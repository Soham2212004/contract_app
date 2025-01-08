import React, { useState, useEffect } from "react";
import "./contract.css";
import axios from "axios";

const Contract: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    contract_name: "",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/contracts");
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts", error);
    }
  };

  const handleAddClick = () => {
    const newContract = {
      contract_name: "",
      start_date: "",
      end_date: "",
    };
    setContracts([...contracts, newContract]);
    setEditingRow(contracts.length);
    setFormData({ contract_name: "", start_date: "", end_date: "" });
    setError(null);
  };

  const handleEditClick = (ContractId: number) => {
    setEditingRow(ContractId);
    setFormData({ ...contracts[ContractId] });
    setError(null);
  };

  const handleSaveClick = async (ContractId: number) => {
    if (!formData.contract_name || !formData.start_date || !formData.end_date) {
      setError("Please fill in all fields before saving.");
      return;
    }

    try {
      const updatedContract = formData;

      if (contracts[ContractId]?.id) {
        await axios.put(
          `http://127.0.0.1:5000/update_contract/${contracts[ContractId].id}`,
          updatedContract,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:5000/add_contract",
          updatedContract,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      fetchContracts();
      setEditingRow(null);
      setError(null);
    } catch (error) {
      console.error("Error saving contract", error);
      alert("There was an error saving the contract");
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_contract/${id}`);
      fetchContracts();
    } catch (error) {
      console.error("Error deleting contract", error);
      alert("There was an error deleting the contract");
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const getMinEndDate = () => {
    return formData.start_date
      ? new Date(formData.start_date).toISOString().split("T")[0]
      : "";
  };

  return (
    <div className="contract-page">
      <div className="header-container">
        <h2 className="contract-title">Contract Dashboard</h2>
        <button className="add-button" onClick={handleAddClick}>
          Add
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="contract-table">
        <thead>
          <tr>
            <th>Contract Id</th>
            <th>Contract Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={contract.id}>
              <td>{index + 1}</td>
              {editingRow === index ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={formData.contract_name || ""}
                      onChange={(e) =>
                        handleInputChange("contract_name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={formData.end_date || ""}
                      onChange={(e) =>
                        handleInputChange("end_date", e.target.value)
                      }
                      min={getMinEndDate()}
                    />
                  </td>
                  <td>
                    <div className="button-container">
                      <button
                        className="save-button"
                        onClick={() => handleSaveClick(index)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setEditingRow(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>{contract.contract_name}</td>
                  <td>{contract.start_date}</td>
                  <td>{contract.end_date}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(index)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(contract.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contract;
