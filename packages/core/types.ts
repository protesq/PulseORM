export type DataType = 'STRING' | 'INTEGER' | 'FLOAT' | 'BOOLEAN' | 'DATE' | 'TIME' | 'TIMESTAMP' | 'JSON' | 'ARRAY' | 'OBJECT' | 'TEXT';

// Bu kısımda column'ların options'larını belirtiyoruz.
export interface ColumnOptions {
    type: DataType;
    allowNull?: boolean;
    defaultValue?: any;
    unique?: boolean; 
    primaryKey?: boolean; 
    autoIncrement?: boolean; 
    comment?: string;
    precision?: number;
    scale?: number; 
    length?: number; 
    nullable?: boolean;
    default?: any; 
}

export interface ModelAttributes { 
    [key: string]: ColumnOptions;
}