import { Expense } from "../types";
import { Request, Response } from "express";

export function createExpenseServer(req: Request, res: Response, expenses: Expense[]) {
    const { id, cost, description } = req.body;

    if (!description || !id || !cost) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const newExpense: Expense = {
        id: id,
        description: description,
        cost: cost,
    };

    expenses.push(newExpense);
    res.status(201).send(newExpense);
}

export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
    // TO DO: Implement deleteExpense function

    const id = req.params.id;

    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    if (expenseIndex === -1) {
        return res.status(404).send({ message: "Expense not found" });
    }

    expenses.splice(expenseIndex, 1);
    console.log("Deleting expense with id:", id);

    return res.status(200).send({ message: "Expense deleted successfully" });
}

export function getExpenses(req: Request, res: Response, expenses: Expense[]) {
    res.status(200).send({ "data": expenses });
}