-- Create Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Create Records Table
CREATE TABLE IF NOT EXISTS Records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT NOT NULL
);

-- Create Cart Table
CREATE TABLE IF NOT EXISTS Cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (record_id) REFERENCES Records(id),
    UNIQUE (user_id, record_id) -- A user can only have one entry per record in the cart
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create Order_Items Table
CREATE TABLE IF NOT EXISTS Order_Items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase REAL NOT NULL, -- To store price at the time of order
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (record_id) REFERENCES Records(id)
);

-- Sample Records Data
INSERT INTO Records (title, artist, genre, price, image_url) VALUES
('Abbey Road', 'The Beatles', 'Rock', 24.99, 'https://picsum.photos/id/10/300/300'),
('Kind of Blue', 'Miles Davis', 'Jazz', 29.99, 'https://picsum.photos/id/20/300/300'),
('The Miseducation of Lauryn Hill', 'Lauryn Hill', 'Hip-Hop', 27.99, 'https://picsum.photos/id/30/300/300'),
('Violin Concerto in D Major', 'Pyotr Ilyich Tchaikovsky', 'Classical', 32.99, 'https://picsum.photos/id/40/300/300'),
('Thriller', 'Michael Jackson', 'Pop', 22.99, 'https://picsum.photos/id/50/300/300'),
('Rumours', 'Fleetwood Mac', 'Rock', 25.99, 'https://picsum.photos/id/60/300/300'),
('A Love Supreme', 'John Coltrane', 'Jazz', 31.99, 'https://picsum.photos/id/70/300/300'),
('To Pimp a Butterfly', 'Kendrick Lamar', 'Hip-Hop', 28.99, 'https://picsum.photos/id/80/300/300'),
('The Four Seasons', 'Antonio Vivaldi', 'Classical', 26.99, 'https://picsum.photos/id/90/300/300'),
('Like a Virgin', 'Madonna', 'Pop', 21.99, 'https://picsum.photos/id/100/300/300'),
('Back in Black', 'AC/DC', 'Rock', 23.99, 'https://picsum.photos/id/110/300/300'),
('Blue Train', 'John Coltrane', 'Jazz', 29.99, 'https://picsum.photos/id/120/300/300');

-- Example User (password: 'password123', hashed with bcryptjs for demonstration)
-- A real application would hash this on signup.
-- This is a temporary placeholder. For actual testing, you'd register a user through the signup endpoint.
-- INSERT INTO Users (name, email, password) VALUES ('Test User', 'test@example.com', '$2a$10$Q73u5jF7p.4P0k.0Z8T.s.r.b2F2D1G.3A.h4Z.p.Y.n.v.C9M.o.'); -- example hash for 'password123'