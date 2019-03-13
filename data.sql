CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text UNIQUE NOT NULL,
    num_employees integer,
    description text,
    logo_url text
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 200, null, null),
         ('ibm', 'IBM', 10, 'not a lot of employees', 'ibm.com');