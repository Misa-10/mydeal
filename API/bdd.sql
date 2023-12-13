CREATE TABLE
    utilisateurs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        pseudo VARCHAR(255) NOT NULL,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    deals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATETIME,
        end_date DATETIME,
        price DECIMAL(10, 2),
        link VARCHAR(255),
        image1 VARCHAR(255),
        image2 VARCHAR(255),
        image3 VARCHAR(255),
        shipping_cost DECIMAL(10, 2),
        creator_id INT,
        base_price DECIMAL(10, 2),
        brand VARCHAR(255),
        votes INT DEFAULT 0
    );