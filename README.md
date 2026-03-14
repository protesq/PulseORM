```
██████╗ ██╗   ██╗██╗     ███████╗███████╗ ██████╗ ██████╗ ███╗   ███╗
██╔══██╗██║   ██║██║     ██╔════╝██╔════╝██╔═══██╗██╔══██╗████╗ ████║
██████╔╝██║   ██║██║     ███████╗█████╗  ██║   ██║██████╔╝██╔████╔██║
██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║
██║     ╚██████╔╝███████╗███████║███████╗╚██████╔╝██║  ██║██║ ╚═╝ ██║
╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
```

> Lightweight TypeScript ORM for MySQL — powered by decorators.

---

> [!WARNING]
> **This project is currently under active development.**
> PulseORM is **not yet published as an npm package**. It cannot be installed via `npm install pulseorm`. To use it, clone the repository and reference it directly in your project.
>
> **Bu proje aktif geliştirme aşamasındadır.**
> PulseORM henüz **npm paketi olarak yayınlanmamıştır**. `npm install pulseorm` ile kurulamaz. Kullanmak için repoyu klonlayıp doğrudan projenize dahil etmeniz gerekmektedir.

---

**Language / Dil:** [English](#english) | [Türkçe](#türkçe)

---

## English

### Why PulseORM?

- **Zero config** — connect and go, no XML or JSON schema files
- **Decorator-based** — define your database schema directly in your TypeScript classes
- **Lightweight** — no bloat, only what you need: `mysql2` + `reflect-metadata`
- **Type-safe** — full TypeScript support, your models are typed from day one
- **Familiar API** — `save()`, `findAll()`, `findById()`, `update()`, `delete()` — readable and intuitive
- **Auto table creation** — call `createTable()` and the schema is built for you

---

### Requirements

- Node.js 16+
- MySQL 5.7+
- TypeScript with `experimentalDecorators` and `emitDecoratorMetadata` enabled

### Installation

```bash
npm install mysql2 reflect-metadata
```

In your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 1. Connect to the database

```ts
import { db } from './packages/core/index';

db.connect({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'yourpassword',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
});
```

### 2. Define a model

```ts
import { Model, Table, Column } from './packages/core/index';

@Table('users')
class User extends Model {
  @Column({ type: 'INTEGER', primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: 'STRING', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'STRING', length: 100, unique: true })
  email!: string;

  @Column({ type: 'INTEGER', default: 18 })
  age?: number;
}
```

### 3. Create the table

```ts
await User.createTable();
```

### CRUD Operations

```ts
// Insert
const user = new User();
user.name = 'John Doe';
user.email = 'john@example.com';
user.age = 25;
await user.save();
console.log(user.id); // auto-assigned insert ID

// Find all
const users = await User.findAll();

// Find by ID
const user = await User.findById(1);

// Update
await user?.update({ age: 30 });

// Delete
await user?.delete();

// Delete by ID
await User.deleteById(1);

// Count
const total = await User.count();
```

### Database & Table Management

```ts
await User.createTable();
await User.dropTable();
await User.createDatabase();  // requires @Database decorator
await User.deleteDatabase();  // requires @Database decorator
```

```ts
import { Database } from './packages/core/index';

@Database('mydb')
@Table('users')
class User extends Model { ... }
```

### Column Options

| Option          | Type      | Description                     |
|-----------------|-----------|---------------------------------|
| `type`          | `DataType`| Column data type (required)     |
| `primaryKey`    | `boolean` | Marks column as primary key     |
| `autoIncrement` | `boolean` | Auto-increment (use with PK)    |
| `nullable`      | `boolean` | Allows NULL values              |
| `unique`        | `boolean` | Enforces unique constraint      |
| `default`       | `any`     | Default value                   |
| `length`        | `number`  | Column length (STRING/INTEGER)  |
| `comment`       | `string`  | Column comment                  |

### Supported Data Types

`STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`, `DATE`, `TIME`, `TIMESTAMP`, `JSON`, `TEXT`

---

## Türkçe

### Neden PulseORM?

- **Sıfır konfigürasyon** — bağlan ve kullan, XML veya JSON şema dosyası yok
- **Decorator tabanlı** — veritabanı şemanı doğrudan TypeScript sınıflarında tanımla
- **Hafif yapı** — sadece ihtiyacın olan şeyler: `mysql2` + `reflect-metadata`
- **Tip güvenli** — tam TypeScript desteği, modellerin başından itibaren tipli
- **Sade API** — `save()`, `findAll()`, `findById()`, `update()`, `delete()` — okunabilir ve sezgisel
- **Otomatik tablo oluşturma** — `createTable()` çağır, şema otomatik oluşsun

---

### Gereksinimler

- Node.js 16+
- MySQL 5.7+
- `experimentalDecorators` ve `emitDecoratorMetadata` aktif TypeScript

### Kurulum

```bash
npm install mysql2 reflect-metadata
```

`tsconfig.json` dosyana ekle:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 1. Veritabanına bağlan

```ts
import { db } from './packages/core/index';

db.connect({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'şifren',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
});
```

### 2. Model tanımla

```ts
import { Model, Table, Column } from './packages/core/index';

@Table('users')
class User extends Model {
  @Column({ type: 'INTEGER', primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: 'STRING', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'STRING', length: 100, unique: true })
  email!: string;

  @Column({ type: 'INTEGER', default: 18 })
  age?: number;
}
```

### 3. Tabloyu oluştur

```ts
await User.createTable();
```

### CRUD İşlemleri

```ts
// Kayıt ekle
const user = new User();
user.name = 'Ali Veli';
user.email = 'ali@example.com';
user.age = 25;
await user.save();
console.log(user.id); // otomatik atanan ID

// Tümünü getir
const users = await User.findAll();

// ID ile bul
const user = await User.findById(1);

// Güncelle
await user?.update({ age: 30 });

// Sil
await user?.delete();

// ID ile sil
await User.deleteById(1);

// Kayıt sayısı
const total = await User.count();
```

### Veritabanı & Tablo Yönetimi

```ts
await User.createTable();   // tablo oluştur
await User.dropTable();     // tabloyu sil

await User.createDatabase();  // @Database decorator gerektirir
await User.deleteDatabase();  // @Database decorator gerektirir
```

```ts
import { Database } from './packages/core/index';

@Database('mydb')
@Table('users')
class User extends Model { ... }
```

### Kolon Seçenekleri

| Seçenek         | Tip       | Açıklama                          |
|-----------------|-----------|-----------------------------------|
| `type`          | `DataType`| Kolon veri tipi (zorunlu)         |
| `primaryKey`    | `boolean` | Primary key olarak işaretle       |
| `autoIncrement` | `boolean` | Otomatik artan (PK ile kullan)    |
| `nullable`      | `boolean` | NULL değere izin ver              |
| `unique`        | `boolean` | Unique kısıtlaması ekle           |
| `default`       | `any`     | Varsayılan değer                  |
| `length`        | `number`  | Kolon uzunluğu (STRING/INTEGER)   |
| `comment`       | `string`  | Kolon yorumu                      |

### Desteklenen Veri Tipleri

`STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`, `DATE`, `TIME`, `TIMESTAMP`, `JSON`, `TEXT`

---
