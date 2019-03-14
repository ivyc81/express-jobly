CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text UNIQUE NOT NULL,
    num_employees integer,
    description text,
    logo_url text
);

CREATE TABLE jobs (
    id serial PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT equity_val_check CHECK ((equity < (1)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 200, null, null),
         ('pixar', 'Pixar Animation Studios', 3000, 'the best', null),
         ('ibm', 'IBM', 10, 'not a lot of employees', 'ibm.com');

INSERT INTO jobs (title, salary, equity, company_handle)
  VALUES ( 'developer', 200000, .1, 'pixar'),
         ( 'animator', 100000, 0.05, 'pixar');