-- Insert sample user
INSERT INTO users (name, email, password)
VALUES ('Vikas', 'vikas@gmail.com', 'hashed_password');

-- Insert contacts
INSERT INTO contacts (user_id, name, email)
VALUES 
(1, 'Father', 'father@gmail.com'),
(1, 'Friend', 'friend@gmail.com');

-- Insert alert
INSERT INTO alerts (user_id, location)
VALUES (1, 'https://maps.google.com/?q=18.5204,73.8567');