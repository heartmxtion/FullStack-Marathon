USE ucode_web;

INSERT INTO `powers` (hero_id, name, points, type) VALUES ( 1, 'iron suit', 200, 'defense');
INSERT INTO `powers` (hero_id, name, points, type) VALUES ( 2, 'bloody fist', 110, 'attack');
INSERT INTO `powers` (hero_id, name, points, type) VALUES ( 3, 'iron shield', 200, 'defense');

INSERT INTO `races` (hero_id, name) VALUES ( 1, 'Human');
INSERT INTO `races` (hero_id, name) VALUES ( 2, 'Kree');
INSERT INTO `races` (hero_id, name) VALUES ( 3, 'Kree');

INSERT INTO `teams` (hero_id, name) VALUES ( 1, 'Avengers');
INSERT INTO `teams` (hero_id, name) VALUES ( 2, 'Hydra');
INSERT INTO `teams` (hero_id, name) VALUES ( 3, 'Avengers');

UPDATE heroes
JOIN races ON heroes.id = races.hero_id
SET heroes.race = races.name;
