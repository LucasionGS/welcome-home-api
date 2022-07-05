import { Router, Request, Response } from "express";
import Todo from "../models/Todo";

export namespace TodoController {
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const useSubTasks = req.query.subTasks === "1";
    const todos = await Todo.findAll({
      where: {
        parentId: null,
      },
      order: [["orderIndex", "ASC"]],
    });

    if (useSubTasks) {
      await Promise.all(todos.map(async todo => todo.getSubTasks()));
    }
    res.json(todos.map(t => t.toJSONWithSubTasks()));
  };
  router.get("/", getAll);

  export const get = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }

    await todo.getSubTasks();
    res.json(todo.toJSONWithSubTasks());
  };
  router.get("/:id", get);

  export const updateOrder = async (req: Request, res: Response) => {
    /**
     * @example
     * const orders: [Id, OrderIndex][]
     */
    const orders = req.body as [number, number][];

    const updates: Promise<Todo>[] = [];
    for (const [id, orderIndex] of orders) {
      const todo = await Todo.findByPk(id);

      if (!todo || todo.orderIndex == orderIndex) {
        // console.log(`Skipping ${id}, Match: ${!!todo && todo.orderIndex == orderIndex}`);
        continue;
      }

      updates.push(todo.update({ orderIndex }));
    }

    await Promise.all(updates);
    res.json({
      success: true
    });
  }
  router.put("/order", updateOrder);

  export const create = async (req: Request, res: Response) => {
    const todo = await Todo.create(req.body);
    res.json(todo);
  };
  router.post("/", create);

  export const update = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }

    await todo.update(req.body);
    res.json(todo);
  }
  router.put("/:id", update);

  export const deleteTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }

    await todo.destroy();
    res.json({
      success: true
    });
  }
  router.delete("/:id", deleteTodo);
}