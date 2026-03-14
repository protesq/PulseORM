/*

Metadata Nedir ? 
Metadata, bir veri yapısının bir nesne ile ilişkilendirilmesi için kullanılan bir mekanizmadır.
Bu ilişkilendirme, veri yapısının davranışını veya özelliklerini değiştirmek için kullanılabilir.
Örneğin, bir sınıfın bir metodunun parametrelerini veya dönüş değerini belirtmek için kullanılabilir.

Reflect.getMetadata(key: string | symbol, target: Object): any
Reflect.defineMetadata(key: string | symbol, value: any, target: Object): void
Reflect.getOwnMetadata(key: string | symbol, target: Object): any
Reflect.defineOwnMetadata(key: string | symbol, value: any, target: Object): void

*/


import 'reflect-metadata'; // reflect-metadata modülünü import ediyoruz. Bu modül sayesinde class'ların metadata'larını okuyabiliriz.
import {DataType, ColumnOptions } from './types';

const columnsMetadataKey = Symbol('columns');
const tableMetadataKey = Symbol('tableName');
const databaseNameMetadataKey = Symbol('databaseName');

export function Table(tableName: string) { 
    return function(target:any) {
        Reflect.defineMetadata(tableMetadataKey,tableName,target);
        return target;
    }
}

export function Column(options: ColumnOptions) { 
    return function(target:any, propertyName:string){
        const columns = Reflect.getOwnMetadata(columnsMetadataKey,target) || {};
        columns[propertyName] = options;
        Reflect.defineMetadata(columnsMetadataKey,columns,target);
    };
}

export function Database(databaseName: string) { 
    return function(target:any) {
        Reflect.defineMetadata(databaseNameMetadataKey,databaseName,target);
        return target;
    }
}

export function getTableName(target:Function): string {
    return Reflect.getMetadata(tableMetadataKey,target);
}

export function getColumnName(target:Function): Record<string, ColumnOptions>  //burda neden record<string, ColumnOptions> kullandık ?
// çünkü column name'leri string olarak saklanıyor ve column options'ları ColumnOptions tipinde saklanıyor.
{
    return Reflect.getMetadata(columnsMetadataKey, target.prototype) || {};
}

export function getDatabaseName(target:Function): string {
    return Reflect.getMetadata(databaseNameMetadataKey,target) || '';
}