import { Database } from "sqlite";
import { Expense } from "../types";
import { Request, Response } from "express";

// export function createExpenseServer(req: Request, res: Response, expenses: Expense[]) {
//     const { id, cost, description } = req.body;

//     if (!description || !id || !cost) {
//         return res.status(400).send({ error: "Missing required fields" });
//     }

//     const newExpense: Expense = {
//         id: id,
//         description: description,
//         cost: cost,
//     };

//     expenses.push(newExpense);
//     res.status(201).send(newExpense);
// }

export async function createExpenseServer(req: Request, res: Response, db: Database) {

    try {
        // Type casting the request body to the expected format.
        const { id, cost, description } = req.body as { id: string, cost: number, description: string };
 
        if (!description || !id || !cost) {
            return res.status(400).send({ error: "Missing required fields" });
        }
 
        await db.run('INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);', [id, description, cost]);
        res.status(201).send({ id, description, cost });
 
    } catch (error) {
 
        return res.status(400).send({ error: `Expense could not be created, + ${error}` });
    };
 
} 
 

// export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
//     const id = req.params.id;

//     const expenseIndex = expenses.findIndex((expense) => expense.id === id);

//     if (expenseIndex === -1) {
//         return res.status(404).send({ message: "Expense not found" });
//     }

//     expenses.splice(expenseIndex, 1);
//     console.log("Deleting expense with id:", id);

//     return res.status(200).send({ message: "Expense deleted successfully" });
// }

export async function deleteExpense(req: Request, res: Response, db: Database) {
    const id = req.params.id;

    try {
        const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);

        if (!expense) {
            return res.status(404).send({ message: "Expense not found" });
        }

        await db.run('DELETE FROM expenses WHERE id = ?', [id]);

        res.status(200).send({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).send({ error: "Unable to delete expense." });
    }
}

export async function getExpenses(req: Request, res: Response, db: Database) {
    try {
        const rows = await db.all('SELECT * FROM expenses');

        res.status(200).send({ data: rows });
    } catch (error) {
        console.error("Error retrieving expenses:", error);
        res.status(500).send({ error: "Unable to retrieve expenses." });
    }
}