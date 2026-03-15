# Changelog

All notable changes to PulseORM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Validation System** (`packages/utils/validators.ts`)
  - Type validators: `isString`, `isNumber`, `isBoolean`, `isDate`, `isObject`, `isArray`
  - DataType validation: `validateDataType()` for all ORM DataTypes
  - Column validation: `validateColumn()` with null checks, type checks, length, precision, and scale validation
  - Additional validators: `isEmail()`, `isURL()`, `isInRange()`, `hasValidLength()`, `matchesPattern()`
  - Custom validator support: `runCustomValidator()` for sync/async validators
  - Custom `ValidationError` class for descriptive error messages
  
- **Testing Infrastructure**
  - Jest test framework setup with TypeScript support
  - Comprehensive test suite for validators (44 test cases)
  - Test coverage reporting (98.66% coverage for validators)
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`

- **Documentation**
  - Validators section added to README (English & Turkish)
  - Usage examples for all validator functions
  - Custom validator implementation guide

- **Relationship System** (`packages/core/relationships.ts`)
  - `hasOne()` - Fetch a single related record by foreign key (1-1 relation)
  - `hasMany()` - Fetch multiple related records by foreign key (1-N relation)

### Changed
- Updated `package.json` with Jest test scripts
- Added `.gitignore` to exclude coverage reports and temporary files

---

## [1.0.0] - Initial Release

### Added
- **Core ORM Features**
  - Decorator-based model definition (`@Table`, `@Column`, `@Database`)
  - MySQL connection management via `mysql2` pool
  - Base `Model` class with essential CRUD operations
  
- **CRUD Operations**
  - `save()` - Insert new records
  - `update()` - Update existing records
  - `delete()` - Delete records
  - `findById()` - Fetch record by primary key
  - `findAll()` - Fetch all records
  - `deleteById()` - Static delete by ID
  - `count()` - Count total records
  
- **Schema Management**
  - `createTable()` - Auto-generate table from model definition
  - `dropTable()` - Drop existing table
  - `createDatabase()` - Create database
  - `deleteDatabase()` - Drop database
  
- **Supported DataTypes**
  - `STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`
  - `DATE`, `TIME`, `TIMESTAMP`
  - `JSON`, `TEXT`, `ARRAY`, `OBJECT`
  
- **Column Options**
  - `primaryKey`, `autoIncrement`, `unique`
  - `nullable`, `allowNull`, `default`
  - `length`, `precision`, `scale`, `comment`

---

# Changelog (Türkçe)

PulseORM'deki tüm önemli değişiklikler bu dosyada belgelenecektir.

---

## [Yayınlanmamış]

### Eklenenler
- **Validasyon Sistemi** (`packages/utils/validators.ts`)
  - Tip doğrulayıcıları: `isString`, `isNumber`, `isBoolean`, `isDate`, `isObject`, `isArray`
  - DataType doğrulama: tüm ORM DataType'ları için `validateDataType()`
  - Kolon doğrulama: null kontrolleri, tip kontrolleri, uzunluk, hassasiyet ve ölçek doğrulama ile `validateColumn()`
  - Ek doğrulayıcılar: `isEmail()`, `isURL()`, `isInRange()`, `hasValidLength()`, `matchesPattern()`
  - Özel doğrulayıcı desteği: senkron/asenkron doğrulayıcılar için `runCustomValidator()`
  - Açıklayıcı hata mesajları için özel `ValidationError` sınıfı
  
- **Test Altyapısı**
  - TypeScript desteğiyle Jest test framework kurulumu
  - Validatörler için kapsamlı test suite'i (44 test case)
  - Test coverage raporlama (validatörler için %98.66 coverage)
  - Test scriptleri: `npm test`, `npm run test:watch`, `npm run test:coverage`

- **Dokümantasyon**
  - README'ye Validators bölümü eklendi (İngilizce ve Türkçe)
  - Tüm validator fonksiyonları için kullanım örnekleri
  - Özel validator implementasyon rehberi

- **İlişki Sistemi** (`packages/core/relationships.ts`)
  - `hasOne()` - Foreign key ile tek ilgili kaydı getirme (1-1 ilişki)
  - `hasMany()` - Foreign key ile birden fazla ilgili kaydı getirme (1-N ilişki)

### Değiştirildi
- `package.json` Jest test scriptleri ile güncellendi
- Coverage raporları ve geçici dosyaları hariç tutmak için `.gitignore` eklendi

---

## [1.0.0] - İlk Sürüm

### Eklenenler
- **Temel ORM Özellikleri**
  - Decorator tabanlı model tanımlama (`@Table`, `@Column`, `@Database`)
  - `mysql2` pool aracılığıyla MySQL bağlantı yönetimi
  - Temel CRUD operasyonları ile `Model` base sınıfı
  
- **CRUD İşlemleri**
  - `save()` - Yeni kayıt ekleme
  - `update()` - Mevcut kayıt güncelleme
  - `delete()` - Kayıt silme
  - `findById()` - Primary key ile kayıt getirme
  - `findAll()` - Tüm kayıtları getirme
  - `deleteById()` - ID ile statik silme
  - `count()` - Toplam kayıt sayısı
  
- **Şema Yönetimi**
  - `createTable()` - Model tanımından otomatik tablo oluşturma
  - `dropTable()` - Mevcut tabloyu silme
  - `createDatabase()` - Veritabanı oluşturma
  - `deleteDatabase()` - Veritabanını silme
  
- **Desteklenen Veri Tipleri**
  - `STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`
  - `DATE`, `TIME`, `TIMESTAMP`
  - `JSON`, `TEXT`, `ARRAY`, `OBJECT`
  
- **Kolon Seçenekleri**
  - `primaryKey`, `autoIncrement`, `unique`
  - `nullable`, `allowNull`, `default`
  - `length`, `precision`, `scale`, `comment`

---

