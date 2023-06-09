-- Drop table if exists
DROP TABLE IF EXISTS stories;

-- Create table
CREATE TABLE stories (
                       id SERIAL PRIMARY KEY,
                       title VARCHAR NOT NULL,
                       first_chapter_id INT,
                       last_chapter_id INT,
                       complete BOOL DEFAULT FALSE,
                       deleted_at TIMESTAMP DEFAULT NULL,
                       FOREIGN KEY (first_chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
                       FOREIGN KEY (last_chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);
