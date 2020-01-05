CREATE TABLE logs (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    log_name TEXT NOT NULL,
    log_date TIMESTAMP NOT NULL DEFAULT now(),
    log_entry TEXT NOT NULL
    );