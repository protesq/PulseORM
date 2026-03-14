import { getTableName, getColumnName, getDatabaseName } from './decorators';
import { db } from './db';
import { ResultSetHeader } from 'mysql2';

export class Model {
    async save() {
        const tableName = getTableName(this.constructor as any);
        const columnName = getColumnName(this.constructor as any);
        if (!tableName || !columnName) throw new Error('Table or column name not found');

        // burada modelin field'larını ve values'larını alıyoruz.
        const fieldsToInsert: string[] = [];
        const valuesToInsert: any[] = [];
        const placeholders: string[] = []; 

        for (const [propertyKey, options] of Object.entries(columnName)) {
            const value = (this as any)[propertyKey];
            if (value !== undefined) {
                fieldsToInsert.push(propertyKey);
                valuesToInsert.push(value);
                placeholders.push('?');
            }
        }
        if (fieldsToInsert.length==0) {
            return;
        }        
        // burada sql query'si oluşturuyoruz.
        const sql = `INSERT INTO ${tableName} (${fieldsToInsert.join(',')}) VALUES (${placeholders.join(',')})`;
        const result = await db.query(sql, valuesToInsert) as ResultSetHeader;
        
        if (result && result.insertId) {
            for (const [propertyKey, options] of Object.entries(columnName)) {
                if (options.primaryKey) {
                    (this as any)[propertyKey] = result.insertId;
                }
            }
        }
        return this;
    }

    async delete() {
        const tableName = getTableName(this.constructor as any);
        const columnName = getColumnName(this.constructor as any);
        if (!tableName || !columnName) throw new Error('Table or column name not found');

        let primaryKeyValue: any = null;
        let primaryKeyName: string = 'id';

        for (const [propertyKey, options] of Object.entries(columnName)) {
            if (options.primaryKey) {
                primaryKeyName = propertyKey;
                primaryKeyValue = (this as any)[propertyKey];
                break;
            }
        }

        if (!primaryKeyValue) throw new Error('Primary key value not found');

        const sql = `DELETE FROM ${tableName} WHERE ${primaryKeyName} = ?`;
        const result = await db.query(sql, [primaryKeyValue]) as ResultSetHeader;
        return result.affectedRows > 0;
    }

    static async deleteById<T extends Model>(this: new () => T, id: number): Promise<boolean> {
        const tableName = getTableName(this);
        if (!tableName) throw new Error('Table name not found');
        const sql = `DELETE FROM ${tableName} WHERE id = ?`;
        const result = await db.query(sql, [id]) as ResultSetHeader;
        return result.affectedRows > 0;
    }

    static async dropTable<T extends Model>(this: new () => T): Promise<boolean> {
        const tableName = getTableName(this);
        if (!tableName) throw new Error('Table name not found');
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        const result = await db.dropTablequery(sql) as ResultSetHeader;
        return true;
    }

    static async deleteDatabase<T extends Model>(this: new () => T): Promise<boolean> {
        const databaseName = getDatabaseName(this);
        if (!databaseName) throw new Error('Database name not found');
        const sql = `DROP DATABASE IF EXISTS ${databaseName}`;
        const result = await db.deleteDatabasequery(sql) as ResultSetHeader;
        return true;
    }

    static async createDatabase<T extends Model>(this: new () => T): Promise<boolean> {
        const databaseName = getDatabaseName(this);
        if (!databaseName) throw new Error('Database name not found');
        const sql = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
        const result = await db.deleteDatabasequery(sql) as ResultSetHeader;
        return true;
    }

    async update(data: any) {
        const tableName = getTableName(this.constructor as any);
        const columnName = getColumnName(this.constructor as any);
        if (!tableName || !columnName) throw new Error('Table or column name not found');

        const fieldsToUpdate: string[] = [];
        const valuesToUpdate: any[] = [];
        let primaryKeyValue: any = null;
        let primaryKeyName: string = 'id';

        for (const [propertyKey, options] of Object.entries(columnName)) {
            if (options.primaryKey) {
                primaryKeyName = propertyKey;
                primaryKeyValue = (this as any)[propertyKey];
            } else if (data[propertyKey] !== undefined) {
                fieldsToUpdate.push(propertyKey);
                valuesToUpdate.push(data[propertyKey]);
                (this as any)[propertyKey] = data[propertyKey];
            }
        }

        if (!primaryKeyValue) throw new Error('Primary key value not found');
        if (fieldsToUpdate.length === 0) return this;

        const sql = `UPDATE ${tableName} SET ${fieldsToUpdate.map(f => `${f}=?`).join(',')} WHERE ${primaryKeyName} = ?`;
        await db.query(sql, [...valuesToUpdate, primaryKeyValue]) as ResultSetHeader;
        return this;
    }

    static async findById<T extends Model>(this: new () => T, id: number): Promise<T | null> {
        const tableName = getTableName(this);
        if (!tableName) throw new Error('Table name not found');
        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        const result = await db.query(sql, [id]) as any[];
        if (result.length > 0) {
            const instance = new this();
            Object.assign(instance, result[0]);
            return instance;
        }
        return null;
    }

    static async findAll<T extends Model>(this: new () => T): Promise<T[]> {
        const tableName = getTableName(this);
        if (!tableName) throw new Error('Table name not found');
        const sql = `SELECT * FROM ${tableName}`;
        const result = await db.query(sql, []) as any[];
        return result.map(row => {
            const instance = new this();
            Object.assign(instance, row);
            return instance;
        });
    }

    static async count<T extends Model>(this: new () => T): Promise<number> {
        const tableName = getTableName(this);
        if (!tableName) throw new Error('Table name not found');
        const sql = `SELECT COUNT(*) as count FROM ${tableName}`;
        const result = await db.query(sql, []) as any[];
        return result[0]?.count || 0;
    }

    static async createTable<T extends Model>(this: new () => T): Promise<void> {
        const tableName = getTableName(this);
        const columnName = getColumnName(this);
        if (!tableName || !columnName) throw new Error('Table or column metadata not found');

        const typeMapping: Record<string, string> = {
            'STRING': 'VARCHAR',
            'INTEGER': 'INT',
            'FLOAT': 'FLOAT',
            'BOOLEAN': 'BOOLEAN',
            'DATE': 'DATE',
            'TIME': 'TIME',
            'TIMESTAMP': 'TIMESTAMP',
            'JSON': 'JSON',
            'TEXT': 'TEXT'
        };

        const columnDefinitions: string[] = [];

        for (const [propertyKey, options] of Object.entries(columnName)) {
            const sqlType = typeMapping[options.type] || 'VARCHAR';
            let columnDef = `${propertyKey} ${sqlType}`;
            
            if (options.length && (sqlType === 'VARCHAR' || sqlType === 'INT')) {
                columnDef += `(${options.length})`;
            }
            
            if (options.primaryKey) {
                columnDef += ' PRIMARY KEY';
            }
            
            if (options.autoIncrement) {
                columnDef += ' AUTO_INCREMENT';
            }
            
            if (options.unique && !options.primaryKey) {
                columnDef += ' UNIQUE';
            }
            
            if (options.nullable === false || options.allowNull === false) {
                columnDef += ' NOT NULL';
            }
            
            if (options.default !== undefined || options.defaultValue !== undefined) {
                const defaultVal = options.default || options.defaultValue;
                if (typeof defaultVal === 'string') {
                    columnDef += ` DEFAULT '${defaultVal}'`;
                } else {
                    columnDef += ` DEFAULT ${defaultVal}`;
                }
            }

            if (options.comment) {
                columnDef += ` COMMENT '${options.comment}'`;
            }

            columnDefinitions.push(columnDef);
        }

        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions.join(', ')})`;
        await db.query(sql, []);
    }
}