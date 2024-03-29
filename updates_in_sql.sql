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
	
	
	ALTER TABLE tma_request_rows
	DROP CONSTRAINT tma_request_rows_itemid_fkey,
	ADD CONSTRAINT tma_request_rows_itemid_fkey
	FOREIGN KEY (itemid)
	REFERENCES item(itemid)
	ON DELETE CASCADE;
	
	-- Add or modify the foreign key constraint with cascading actions
ALTER TABLE tma_request_rows
DROP CONSTRAINT IF EXISTS fk_tma_request_row_requestid;

ALTER TABLE tma_request_rows
ADD CONSTRAINT fk_tma_request_row_requestid
FOREIGN KEY (requestid)
REFERENCES tma_requests(requestid)
ON DELETE CASCADE
ON UPDATE CASCADE;