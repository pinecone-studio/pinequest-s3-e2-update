-- Багшийн үүрэг / заадаг хичээлийн төрөл (жишээ: Математик). Одоогийн мөрүүдэд DEFAULT.
ALTER TABLE `teacher` ADD COLUMN `role` text NOT NULL DEFAULT '-';
