# MySQL Elisa Driver

[![NPM version](http://img.shields.io/npm/v/elisa-mysql.svg)](https://www.npmjs.org/package/elisa-mysql)
[![Build Status](https://travis-ci.org/elisajs/elisa-mysql.svg?branch=master)](https://travis-ci.org/elisajs/elisa-mysql)
[![Dependency Status](https://david-dm.org/elisajs/elisa-mysql.svg)](https://david-dm.org/elisajs/elisa-mysql)
[![devDependency Status](https://david-dm.org/elisajs/elisa-mysql/dev-status.svg)](https://david-dm.org/elisajs/elisa-mysql#info=devDependencies)

**MySQL**/**MariaDB** *Elisa* driver.
This driver complies with [Elisa 0.5 spec](https://github.com/elisajs/elisa).

*Proudly made with ♥ in Valencia, Spain, EU.*

## Driver load

The driver must be loaded importing the package and then you can use the `Driver` class
to get the driver:

```
const Driver = require("elisa-mysql").Driver;
const driver = Driver.getDriver("MySQL");
```

You can also use the `MariaDB` alias, instead of the `MySQL` name.

## Connections

The options to create a connection:

- `host` (string). The DB server name/IP.
- `port` (number). The DB server port.
- `db` (string). The database name.
- `username` (string). The username.
- `password` (string). The password.

Example:

```
var cx = driver.createConnection({host: "localhost", port: 3306, db: "mydb", username: "root", password: "pwd"});
```

## Stores

The stores aren't supported by *MySQL* and *MariaDB* natively. These are implemented
using tables with two text columns: `id` and `value`:

```
--without namespace
CREATE TABLE `bands`(id VARCHAR(256) PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE `bands`(id VARCHAR(256) PRIMARY KEY, value VARCHAR(60000) NOT NULL);

--with namespace
CREATE TABLE `my.bands`(id VARCHAR(256) PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE `my.bands`(id VARCHAR(256) PRIMARY KEY, value VARCHAR(60000) NOT NULL);
```

## Collections

Right now, the collections are supported by *MySQL* natively, but *MariaDB* doesn't.
The *Elisa* driver only supports the *MariaDB* collections using dynamic columns and tables as:

```
--without namespace
CREATE TABLE `bands`(id VARCHAR(256) PRIMARY KEY, doc BLOB NOT NULL);
CREATE TABLE `bands`(id int PRIMARY KEY AUTO_INCREMENT, doc BLOB NOT NULL);

--with namespace
CREATE TABLE `my.bands`(id VARCHAR(256) PRIMARY KEY, doc BLOB NOT NULL);
CREATE TABLE `my.bands`(id int PRIMARY KEY AUTO_INCREMENT, doc BLOB NOT NULL);
```

Notes:

- The boolean values are saved as strings with `$` starting the value: `$true` or `$false`.
  The driver converts `$true` to `true` and `$false` to `false` and vice versa.
- The array and object values are saved as strings using their JSON representation, starting with
  `$`. The driver does the bidirectional transformation.
