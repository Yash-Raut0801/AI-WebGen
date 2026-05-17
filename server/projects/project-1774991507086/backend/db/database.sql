CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL -- In a real application, passwords should be hashed (e.g., using bcrypt).
);

CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (record_id) REFERENCES records(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (record_id) REFERENCES records(id)
);

-- Sample Data for Records
INSERT INTO records (title, artist, genre, price, image_url) VALUES
('Abbey Road', 'The Beatles', 'Rock', 24.99, 'https://picsum.photos/id/101/300/300'),
('Kind of Blue', 'Miles Davis', 'Jazz', 29.99, 'https://picsum.photos/id/102/300/300'),
('The Miseducation of Lauryn Hill', 'Lauryn Hill', 'Hip-Hop', 27.99, 'https://picsum.photos/id/103/300/300'),
('The Dark Side of the Moon', 'Pink Floyd', 'Rock', 26.99, 'https://picsum.photos/id/104/300/300'),
('A Love Supreme', 'John Coltrane', 'Jazz', 28.99, 'https://picsum.photos/id/105/300/300'),
('Thriller', 'Michael Jackson', 'Pop', 22.99, 'https://picsum.photos/id/106/300/300'),
('The Blueprint', 'Jay-Z', 'Hip-Hop', 25.99, 'https://picsum.photos/id/107/300/300'),
('21', 'Adele', 'Pop', 21.99, 'https://picsum.photos/id/108/300/300'),
('Discovery', 'Daft Punk', 'Pop', 23.99, 'https://picsum.photos/id/109/300/300'),
('Random Access Memories', 'Daft Punk', 'Pop', 24.99, 'https://picsum.photos/id/110/300/300'),
('Led Zeppelin IV', 'Led Zeppelin', 'Rock', 25.99, 'https://picsum.photos/id/111/300/300'),
('Blue Train', 'John Coltrane', 'Jazz', 27.99, 'https://picsum.photos/id/112/300/300'),
('Midnight Marauders', 'A Tribe Called Quest', 'Hip-Hop', 26.99, 'https://picsum.photos/id/113/300/300'),
('Pet Sounds', 'The Beach Boys', 'Rock', 23.99, 'https://picsum.photos/id/114/300/300'),
('Come Away With Me', 'Norah Jones', 'Jazz', 21.99, 'https://picsum.photos/id/115/300/300'),
('Tapestry', 'Carole King', 'Pop', 20.99, 'https://picsum.photos/id/116/300/300'),
('The Chronic', 'Dr. Dre', 'Hip-Hop', 28.99, 'https://picsum.photos/id/117/300/300'),
('Nevermind', 'Nirvana', 'Rock', 24.99, 'https://picsum.photos/id/118/300/300'),
('What''s Going On', 'Marvin Gaye', 'Soul', 26.99, 'https://picsum.photos/id/119/300/300'),
('Rumours', 'Fleetwood Mac', 'Rock', 23.99, 'https://picsum.photos/id/120/300/300');