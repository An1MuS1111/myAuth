import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import { User } from "./User";

interface UserPaymentAttributes {
    id: number;
    user_id: number;
    payment_type: string;
    provider: string;
    account_no: number;
    expiry: Date;
}

interface UserPaymentCreationAttributes
    extends Optional<UserPaymentAttributes, "id"> {}

export class UserPayment
    extends Model<UserPaymentAttributes, UserPaymentCreationAttributes>
    implements UserPaymentAttributes
{
    public id!: number;
    public user_id!: number;
    public payment_type!: string;
    public provider!: string;
    public account_no!: number;
    public expiry!: Date;

    public static initModel(sequelize: Sequelize) {
        UserPayment.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                user_id: { type: DataTypes.INTEGER, allowNull: false },
                payment_type: DataTypes.STRING,
                provider: DataTypes.STRING,
                account_no: DataTypes.INTEGER,
                expiry: DataTypes.DATE,
            },
            {
                sequelize,
                modelName: "UserPayment",
                tableName: "UserPayments",

                underscored: true,
                timestamps: false,
            }
        );
    }

    public static associate() {
        UserPayment.belongsTo(User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    }
}
