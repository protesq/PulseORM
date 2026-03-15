import { Model } from './Model';
import { getTableName } from './decorators';
import { db } from './db';

export class Relationships {

    // foreignKey: ilgili tablodaki kolon adı (örn: 'user_id')
    // primaryKeyValue: mevcut modelin ID değeri (örn: this.id)
    // Amaç : foreignKey ile primaryKeyValue eşleşen kaydı getirmek. 1-1 ilişkisi için kullanılır.
    static async hasOne(model: typeof Model, foreignKey: string, primaryKeyValue: number | string): Promise<Model | null> {
        const tableName = getTableName(model);
        if (!tableName) throw new Error('Table name not found');

        const sql = `SELECT * FROM ${tableName} WHERE ${foreignKey} = ?`;
        const result = await db.query(sql, [primaryKeyValue]) as any[];

        if (result.length > 0) {
            const instance = new model();
            Object.assign(instance, result[0]);
            return instance;
        }
        return null;
    }

    // Amaç : foreignKey ile primaryKeyValue eşleşen tüm kayıtları getirmek. 1-N ilişkisi için kullanılır.
    static async hasMany(model: typeof Model, foreignKey: string, primaryKeyValue: number | string): Promise<Model[]> {
        const tableName = getTableName(model);
        if (!tableName) throw new Error('Table name not found');
        const sql = `SELECT * FROM ${tableName} WHERE ${foreignKey} = ?`;
        const result = await db.query(sql, [primaryKeyValue]) as any[];
        return result.map(row=>{
            const instance = new model();
            Object.assign(instance, row);
            return instance;
        });
    }
}