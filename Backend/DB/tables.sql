create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    email varchar(50),
    password varchar(250),
    role varchar(20),
    status varchar(20),
    UNIQUE (email)
);

insert into
    user(name, email, password, status, role)
values
    (
        'Admin',
        'admin@admin.com',
        'admin',
        'true',
        'admin'
    );

-- create table category(
--     id int NOT NULL AUTO_INCREMENT,
--     name varchar(255) NOT NULL UNIQUE,
--     primary key(id)
-- );

create table transaction(
    id int NOT NULL AUTO_INCREMENT,
    libelle varchar(255) NOT NULL ,
    date_transaction Date NOT NULL,
    recette int,
    depence int,
    userID int NOT NULL,
    primary key(id)
);

create table bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL UNIQUE,
    date datetime NOT NULL,
    transactionsDetails JSON DEFAULT NULL,
    primary key(id)
);