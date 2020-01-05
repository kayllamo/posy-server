
-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE users, logs RESTART IDENTITY CASCADE;


-- DROP the tables and constraints
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS logs;

-- create the users table without the foreign key
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL, 
    user_password TEXT NOT NULL
);

-- insert values into users
INSERT INTO users
  (user_name, user_email, user_password)
  VALUES
    ('Kayla Bear', 'kaylabear@testemail.com', 'testingpassword'),
    ('Sammy Bear', 'sammybear@testemail.com', 'testpassword'),
    ('Care Bear', 'carebear@testemail.com', 'carepassword'),
    ('Sasha Bear', 'sashabear@testemail.com', 'sashapassword')
  ;

-- create the logs table


CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    log_name TEXT NOT NULL,
    log_date TIMESTAMP NOT NULL DEFAULT now(),
    log_entry TEXT NOT NULL
  );

-- insert 4 notes
INSERT INTO logs
  (log_name, log_date, log_entry)
  VALUES
    ('New Year Goals', '10/4/2019', 'I really want to get a new job where I incorporate my new skills as a software developer.'),
    ('Oh baby!', '8/2/2019', 'Lauren is officially a mom. It is exciting to think about this little nugget that will be joining us!'),
    ('Anniversary', '11/12/2019', 'I am excited to celebrate our love today!'),
    ('At a loss', '09/1/2003', 'We lost grandma. I can''t believe she''s gone..'), 
    ('Normal Day', '1/3/2006', 'Thankful for today being a normal day. Nothing crazy, super relaxed, etc.'), 
    ('Always Learning', '10/3/2019', 'I''d love to learn how to swim, how to speak Spanish, and how to code!')
    ;


