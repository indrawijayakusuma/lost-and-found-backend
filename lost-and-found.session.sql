SELECT * FROM posts;

DELETE FROM users;
SELECT * FROM otps
DELETE FROM otps
SELECT * FROM found_items
DELETE FROM users

SELECT posts.post_id, item_name, location, address, additional_info, found_items.date, found_items.image, users.fullname, users.picture 
FROM posts 
LEFT JOIN found_items ON found_items.post_id = posts.post_id
LEFT JOIN locations ON locations.found_item_id = found_items.post_id
LEFT JOIN users ON users.user_id = posts.user_id
WHERE posts.post_id = 'post-ALQMuy6tk77efqWd'


DROP TABLE found_items, posts, locations, users, otps, users, questions, pgmigrations

DROP TABLE authentications

SELECT posts.post_id, is_claimed, posts.date as post_date, tipe_barang, color, secondary_color, found_items.date as found_date,
found_items.image, label_location, location, address, additional_info
FROM posts 
INNER JOIN found_items ON found_items.post_id = posts.post_id
INNER JOIN locations ON locations.found_item_id= found_items.post_id
WHERE is_claimed = false

SELECT posts.post_id, item_name, location, address, status_validation  
FROM posts 
INNER JOIN found_items ON found_items.post_id = posts.post_id
INNER JOIN locations ON locations.location_id = found_items.post_id
WHERE user_id = 1

SELECT posts.post_id, is_claimed, posts.date as post_date, item_name, tipe_barang, color, secondary_color, found_items.date as found_date,
found_items.image, label_location, location, address, additional_info
FROM posts 
INNER JOIN found_items ON found_items.post_id = posts.post_id
INNER JOIN locations ON locations.found_item_id= found_items.post_id
WHERE is_claimed = false
OFFSET 0 LIMIT 10