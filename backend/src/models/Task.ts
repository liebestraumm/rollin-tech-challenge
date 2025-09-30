import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";

interface TaskAttributes {
  id: number;
  created: Date;
  title: string;
  description?: string;
  complete: boolean;
  due?: Date;
}

class Task
  extends Model<TaskAttributes, Optional<TaskAttributes, "id" | "created">>
  implements TaskAttributes
{
  declare id: number;
  declare created: Date;
  declare title: string;
  declare description?: string;
  declare complete: boolean;
  declare due?: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    due: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: false,
  }
);

export default Task;
