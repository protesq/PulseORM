import mysql from 'mysql2/promise';

class DB {
    private pool: mysql.Pool | null = null; // neden böyle yaptık ? çünkü mysql2/promise'ın pool sınıfını kullanıyoruz ve pool sınıfının instance'ını oluşturuyoruz.
    connect(config: mysql.PoolOptions) {
        this.pool = mysql.createPool(config);
        console.log('Connected to the database');
    }

    async query(sql:string, params:any[]): Promise<any>{
        if(!this.pool) throw new Error('Not connected to the database');
        const [rows]  = await this.pool.query(sql, params);
        return rows;
    }

    async dropTablequery(sql:string): Promise<any>{
        if(!this.pool) throw new Error('Not connected to the database');
        const [rows]  = await this.pool.execute(sql);
        return rows;
    }

    async deleteDatabasequery(sql:string): Promise<any>{
        if(!this.pool) throw new Error('Not connected to the database');
        const [rows]  = await this.pool.execute(sql);
        return rows;
    }

}

export const db = new DB();