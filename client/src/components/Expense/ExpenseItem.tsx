import { Expense } from "../../types/types";
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteExpense, fetchExpenses } from "../../utils/expense-utils";

const ExpenseItem = (currentExpense: Expense) => {
  // Exercise: Consume the AppContext here
  const { expenses, setExpenses } = useContext(AppContext);

  const handleDeleteExpense = (currentExpense: Expense) => {
    // Exercise: Remove expense from expenses context array
    deleteExpense(currentExpense.id).then(() => {
      fetchExpenses();  // Fetch the updated list of expenses
    });
    const updatedExpenses = expenses.filter((expense) => expense.id !== currentExpense.id);
    setExpenses(updatedExpenses);
    // deleteExpense(currentExpense.id);
    // const updatedExpenses = expenses.filter((expense) => expense.id !== currentExpense.id);
    // setExpenses(updatedExpenses);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>{currentExpense.description}</div>
      <div>${currentExpense.cost}</div>
      <div>
        <button onClick={() => handleDeleteExpense(currentExpense)}>x</button>
      </div>
    </li>
  );
};

export default ExpenseItem;
