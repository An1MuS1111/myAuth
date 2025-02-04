import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import { User } from "./User";

interface UserAddressAttributes {
    id: number;
    user_id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code: string;
    country: string;
    telephone?: string;
    mobile?: string;
}

interface UserAddressCreationAttributes
    extends Optional<UserAddressAttributes, "id"> {}

export class UserAddress
    extends Model<UserAddressAttributes, UserAddressCreationAttributes>
    implements UserAddressAttributes
{
    public id!: number;
    public user_id!: number;
    public address_line1!: string;
    public address_line2?: string;
    public city!: string;
    public postal_code!: string;
    public country!: string;
    public telephone?: string;
    public mobile?: string;

    public static initModel(sequelize: Sequelize) {
        UserAddress.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                user_id: { type: DataTypes.INTEGER, allowNull: false },
                address_line1: DataTypes.STRING,
                address_line2: DataTypes.STRING,
                city: DataTypes.STRING,
                postal_code: DataTypes.STRING,
                country: DataTypes.STRING,
                telephone: DataTypes.STRING,
                mobile: DataTypes.STRING,
            },
            {
                sequelize,
                modelName: "UserAddress",
                tableName: "UserAddresses",

                underscored: true,
                timestamps: false,
            }
        );
    }

    public static associate() {
        UserAddress.belongsTo(User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    }
}
