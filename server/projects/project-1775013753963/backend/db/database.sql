PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS Cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (record_id) REFERENCES Records(id) ON DELETE CASCADE,
    UNIQUE (user_id, record_id) -- Ensures only one entry per record per user
);

CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Order_Items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (record_id) REFERENCES Records(id) ON DELETE CASCADE
);

-- Sample Data for Records
INSERT OR IGNORE INTO Records (id, title, artist, genre, price, image_url) VALUES
(1, 'The Dark Side of the Moon', 'Pink Floyd', 'Rock', 29.99, 'https://picsum.photos/id/10/300/300'),
(2, 'Kind of Blue', 'Miles Davis', 'Jazz', 27.50, 'https://picsum.photos/id/20/300/300'),
(3, 'Straight Outta Compton', 'N.W.A', 'Hip-Hop', 25.00, 'https://picsum.photos/id/30/300/300'),
(4, 'Symphony No. 5', 'Ludwig van Beethoven', 'Classical', 32.00, 'https://picsum.photos/id/40/300/300'),
(5, 'Thriller', 'Michael Jackson', 'Pop', 28.99, 'https://picsum.photos/id/50/300/300'),
(6, 'Led Zeppelin IV', 'Led Zeppelin', 'Rock', 31.99, 'https://picsum.photos/id/60/300/300'),
(7, 'A Love Supreme', 'John Coltrane', 'Jazz', 26.75, 'https://picsum.photos/id/70/300/300'),
(8, 'The Chronic', 'Dr. Dre', 'Hip-Hop', 24.50, 'https://picsum.photos/id/80/300/300'),
(9, 'The Four Seasons', 'Antonio Vivaldi', 'Classical', 29.50, 'https://picsum.photos/id/90/300/300'),
(10, '21', 'Adele', 'Pop', 23.99, 'https://picsum.photos/id/100/300/300');