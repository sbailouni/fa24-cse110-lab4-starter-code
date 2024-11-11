import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { createExpense } from "../../utils/expense-utils";
import { v4 as uuidv4 } from 'uuid';

const AddExpenseForm = () => {
  // Exercise: Consume the AppContext here
  const { expenses, setExpenses } = useContext(AppContext);

  // Exercise: Create name and cost to state variables
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedCost = parseInt(cost);
    if (isNaN(parsedCost) || parsedCost <= 0) {
      alert('Please enter a valid cost.');
      return;
    }
    // Exercise: Add add new expense to expenses context array
    const newExpense = {id: uuidv4(), description: name, cost: parsedCost};

    createExpense(newExpense);

    setExpenses([...expenses, newExpense]);

    setName('');
    setCost('');
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="number"
            className="form-control"
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          ></input>
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;