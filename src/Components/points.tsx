import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './points.css';

interface Contract {
  value: any;
  id: number;
  contract_name: string;
}

interface Point {
  id: number;
  contract_id: number;
  point: string;
  value: string;
}

const Points = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [showFields, setShowFields] = useState(false);
  const [point, setPoint] = useState('');
  const [value, setValue] = useState('');
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('http://localhost:5000/contracts');
        const data = await response.json();
        if (Array.isArray(data)) {
          setContracts(data);
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, []);

  const fetchPoints = async (contractId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/get_points/${contractId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPoints(data);
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const handleDropdownChange = (selectedOption: any) => {
    setSelectedContract(selectedOption);
    setShowFields(false);
    setEditingPoint(null);
    fetchPoints(selectedOption.value);
  };

  const handleAddButtonClick = () => {
    setShowFields(true);
    setEditingPoint(null);
  };

  const handleSaveButtonClick = async () => {
    if (!selectedContract) return;

    const payload = {
      contract_id: selectedContract.value,
      point,
      value,
    };

    try {
      const url = editingPoint
        ? `http://localhost:5000/update_point/${editingPoint.id}`
        : 'http://localhost:5000/add_point';
      const method = editingPoint ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setPoint('');
        setValue('');
        setShowFields(false);
        setEditingPoint(null);
        fetchPoints(selectedContract.value);
      }
    } catch (error) {
      console.error('Error saving point:', error);
    }
  };

  const handleEditButtonClick = (point: Point) => {
    setPoint(point.point);
    setValue(point.value);
    setEditingPoint(point);
    setShowFields(true);
  };

  const handleDeleteButtonClick = async (pointId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_point/${pointId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        if (selectedContract) {
          fetchPoints(selectedContract.value);
        }
      }
    } catch (error) {
      console.error('Error deleting point:', error);
    }
  };

  return (
    <div className="point-page">
      <div className="header-container">
        <h2 className="point-title">Points</h2>
      </div>

      <div className="dropdown-container">
        <div className="dropdown-add-container">
          <Select
            value={selectedContract}
            onChange={handleDropdownChange}
            options={contracts.map((contract) => ({
              value: contract.id,
              label: contract.contract_name,
            }))}
            placeholder="Select a Contract"
            className="contract-dropdown"
          />
          {selectedContract && (
            <button className="add-button" onClick={handleAddButtonClick}>
              Add
            </button>
          )}
        </div>
      </div>

      {showFields && (
        <div className="fields-container">
          <div className="field">
            <label>Point:</label>
            <input
              type="text"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="Enter point"
            />
          </div>
          <div className="field">
            <label>Value:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>
          <button className="save-button" onClick={handleSaveButtonClick}>
            Save
          </button>
        </div>
      )}

      {points.length > 0 && (
        <div className="points-list">
          <h3>Points List:</h3>
          <table className="points-table">
            <thead>
              <tr>
                <th>Point</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.id}>
                  <td>{point.point}</td>
                  <td>{point.value}</td>
                  <td>
                    <button onClick={() => handleEditButtonClick(point)}>Edit</button>
                    <button onClick={() => handleDeleteButtonClick(point.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Points;
