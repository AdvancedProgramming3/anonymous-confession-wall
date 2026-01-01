INSERT IGNORE INTO users (id, username, password) VALUES (1, 'anonymous_soul', 'pass123');

INSERT IGNORE INTO confessions (content, likes, user_id)
VALUES ('This is a test confession from TiDB!', 5, 1);