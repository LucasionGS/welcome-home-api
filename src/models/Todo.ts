import sql from "../sql";
import { Model, DataTypes } from "sequelize";

interface TodoAttributes {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  parentId: number;
  orderIndex: number;
}

interface TodoCreationAttributes extends Partial<TodoAttributes> {
  title: string;
  description: string;
}

export default class Todo extends Model<TodoAttributes, TodoCreationAttributes> {
  public id: number;
  /**
   * Title to be displayed in the UI.
   */
  public title: string;
  /**
   * Detailed description of the task.
   */
  public description: string;
  /**
   * Due date of the task, if any.
   */
  public dueDate?: Date;
  /**
   * Whether the task is completed or not.
   */
  public completed: boolean;
  /**
   * Parent task, if any.
   */
  public parentId?: number;
  /**
   * Order index of the task. This is used to order the tasks in the UI.
   */
  public orderIndex: number;

  public subTasks?: Todo[];
  public async getSubTasks(): Promise<Todo[]> {
    this.subTasks = (await Todo.findAll({
      where: {
        parentId: this.id,
      },
      order: [["orderIndex", "ASC"]],
    })) || [];
    return this.subTasks;
  };

  public toJSONWithSubTasks() {
    const todo = this.toJSON<TodoAttributes>();
    return {
      ...todo,
      subTasks: this.subTasks,
    };
  }
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: sql,
    tableName: "todos"
  },
);
console.log("Todo Model loaded");