SELECT * FROM users;

DELETE FROM users;
SELECT * FROM otps
DELETE FROM otps
SELECT * FROM found_items
DELETE FROM users


DROP TABLE found_items, posts, locations, users, otps, users, questions, pgmigrations

DROP TABLE authentications

SELECT posts.post_id, is_claimed, posts.date as post_date, tipe_barang, color, secondary_color, found_items.date as found_date,
found_items.image, label_location, location, address, additional_info
FROM posts 
INNER JOIN found_items ON found_items.post_id = posts.post_id
INNER JOIN locations ON locations.location_id = found_items.post_id
WHERE is_claimed = false

SELECT posts.post_id, item_name, location, address, status_validation  
FROM posts 
INNER JOIN found_items ON found_items.post_id = posts.post_id
INNER JOIN locations ON locations.location_id = found_items.post_id
WHERE user_id = 1