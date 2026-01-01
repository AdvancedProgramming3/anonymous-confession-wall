CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS confessions (
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           content TEXT NOT NULL,
                                           likes INT DEFAULT 0,
                                           user_id INT NOT NULL,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS advice (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      content TEXT NOT NULL,
                                      likes INT DEFAULT 0,
                                      user_id INT NOT NULL,
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );