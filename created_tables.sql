-- Database: TMA_Warehouse

-- DROP DATABASE IF EXISTS "TMA_Warehouse";

CREATE DATABASE "TMA_Warehouse"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1254'
    LC_CTYPE = 'English_United States.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
--creating item table	
CREATE TABLE item (
	ItemID SERIAL PRIMARY KEY ,
	ItemGroup TEXT NOT NULL,
    UnitOfMeasurement TEXT NOT NULL,
    Quantity INTEGER NOT NULL,
    PriceWithoutVAT INTEGER NOT NULL,
    Status VARCHAR(25) NOT NULL,
    StorageLocation TEXT,
    ContactPerson TEXT,
    Photo BYTEA 
)
--creating request table
CREATE TABLE TMA_Requests(
	RequestID SERIAL PRIMARY KEY,
	EmployeeName TEXT NOT NULL,
	ItemID INTEGER NOT NULL,
	UnitOfMeasurement TEXT NOT NULL,
  	Quantity INTEGER NOT NULL,
  	PriceWithoutVat INTEGER NOT NULL,
  	Comment TEXT,
  	Status TEXT,
  	RequestRowID INTEGER NOT NULL UNIQUE,
	FOREIGN KEY (ItemID) REFERENCES item(ItemID)
)
--creating requestrow table
CREATE TABLE TMA_Reqquest_Rows(
	RequestID INTEGER NOT NULL,
	RequestRowID INTEGER NOT NULL ,
	ItemID INTEGER NOT NULL,
	UnitOfMeasurement TEXT NOT NULL,
	Quantity INTEGER NOT NULL,
	PriceWithoutVat INTEGER NOT NULL,
	Comment TEXT,
	FOREIGN KEY (ItemID) REFERENCES item(ItemID),
	FOREIGN KEY (RequestRowID) REFERENCES TMA_Requests(RequestRowID)
)


--creating users table for identify access
CREATE TABLE Users(
	UserID SERIAL PRIMARY KEY,
	UserName VARCHAR(25),
	Password TEXT
)

















