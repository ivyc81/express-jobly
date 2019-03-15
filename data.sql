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

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text,
    is_admin boolean DEFAULT false NOT NULL
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 200, null, null),
         ('pixar', 'Pixar Animation Studios', 3000, 'the best', null),
         ('ibm', 'IBM', 10, 'not a lot of employees', 'ibm.com');

INSERT INTO jobs (title, salary, equity, company_handle)
  VALUES ( 'developer', 200000, .1, 'pixar'),
         ( 'animator', 100000, 0.05, 'pixar');

INSERT INTO users (username, password, first_name, last_name, email, photo_url)
  VALUES ( 'coconut', 'popcorn', 'Whiskey', 'Land', 'whiskey@dog.com', NULL),
         ( 'spike', 'popcorn', 'Spkie', 'Land', 'spike@dog.com', NULL);