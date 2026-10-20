-- =========================================================================
-- GNANA SUDHA DATABASE MULTILINGUAL MIGRATION SCRIPT
-- Safely adds Telugu language columns (name_te, description_te)
-- to categories, products, poojas, and homams without modifying existing data.
-- =========================================================================

-- 1. Safely add columns to `categories`
SET @dbname = DATABASE();
SET @tablename = "categories";

-- Add `name_te` to categories if not exists
SET @columnname = "name_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `name_te` VARCHAR(255) NULL AFTER `name`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add `desc_te` to categories if not exists
SET @columnname = "desc_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `desc_te` TEXT NULL AFTER `desc`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Safely add columns to `products`
SET @tablename = "products";

-- Add `name_te` to products if not exists
SET @columnname = "name_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `name_te` VARCHAR(255) NULL AFTER `name`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add `desc_te` to products if not exists
SET @columnname = "desc_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `desc_te` TEXT NULL AFTER `desc`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 3. Safely add columns to `poojas`
SET @tablename = "poojas";

-- Add `name_te` to poojas if not exists
SET @columnname = "name_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `name_te` VARCHAR(255) NULL AFTER `name`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add `desc_te` to poojas if not exists
SET @columnname = "desc_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `desc_te` TEXT NULL AFTER `desc`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 4. Safely add columns to `homams`
SET @tablename = "homams";

-- Add `name_te` to homams if not exists
SET @columnname = "name_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `name_te` VARCHAR(255) NULL AFTER `name`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add `desc_te` to homams if not exists
SET @columnname = "desc_te";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `desc_te` TEXT NULL AFTER `desc`")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;


-- =========================================================================
-- SEED INITIAL TELUGU CONTENT (Idempotent updates for existing records)
-- =========================================================================

-- Populate Categories Telugu names
UPDATE categories SET name_te = 'పూజా సామగ్రి కిట్లు' WHERE name LIKE '%Pooja Kits%' OR slug = 'pooja-kits';
UPDATE categories SET name_te = 'హోమం సామగ్రి' WHERE name LIKE '%Homam Samagri%' OR slug = 'homam-samagri';
UPDATE categories SET name_te = 'అగరుబత్తులు & ధూపం' WHERE name LIKE '%Incense%' OR slug = 'incense-dhoop';
UPDATE categories SET name_te = 'దీపాలు & ఇత్తడి కుందులు' WHERE name LIKE '%Diyas%' OR slug = 'diyas-lamps';
UPDATE categories SET name_te = 'కుంకుమ & పవిత్ర చందనం' WHERE name LIKE '%Kumkum%' OR slug = 'kumkum-chandan';
UPDATE categories SET name_te = 'విగ్రహాలు & పవిత్ర అలంకరణ' WHERE name LIKE '%Idols%' OR slug = 'idols-decor';
UPDATE categories SET name_te = 'రుద్రాక్ష & జపమాలలు' WHERE name LIKE '%Rudraksha%' OR slug = 'rudraksha-malas';
UPDATE categories SET name_te = 'పండుగ ప్రత్యేక సామాగ్రి' WHERE name LIKE '%Festival%' OR slug = 'festival-essentials';

-- Populate Poojas Telugu names
UPDATE poojas SET name_te = 'శ్రీ సత్యనారాయణ స్వామి వ్రతం' WHERE name LIKE '%Satyanarayana%';
UPDATE poojas SET name_te = 'గణపతి హోమం / పూజ' WHERE name LIKE '%Ganapathi%' OR name LIKE '%Ganesha%';
UPDATE poojas SET name_te = 'లక్ష్మీ కుబేర పూజ' WHERE name LIKE '%Lakshmi Kubera%';
UPDATE poojas SET name_te = 'గృహప్రవేశ శాంతి పూజ' WHERE name LIKE '%Gruhapravesham%';
UPDATE poojas SET name_te = 'రుద్రాభిషేకం' WHERE name LIKE '%Rudrabhishekam%';
UPDATE poojas SET name_te = 'నవగ్రహ శాంతి పూజ' WHERE name LIKE '%Navagraha%';
UPDATE poojas SET name_te = 'సరస్వతీ దేవి పూజ / అక్షరాభ్యాసం' WHERE name LIKE '%Saraswati%';
UPDATE poojas SET name_te = 'వాస్తు శాంతి పూజ' WHERE name LIKE '%Vastu%' OR name LIKE '%Vaastu%';
UPDATE poojas SET name_te = 'సుదర్శన హోమం / పూజ' WHERE name LIKE '%Sudarshana%';
UPDATE poojas SET name_te = 'మృత్యుంజయ హోమం / పూజ' WHERE name LIKE '%Mrityunjaya%';

-- Populate Homams Telugu names
UPDATE homams SET name_te = 'మహా గణపతి హోమం' WHERE name LIKE '%Ganapathi%' OR name LIKE '%Ganesha%';
UPDATE homams SET name_te = 'చండీ హోమం' WHERE name LIKE '%Chandi%';
UPDATE homams SET name_te = 'శ్రీ సుదర్శన హోమం' WHERE name LIKE '%Sudarshana%';
UPDATE homams SET name_te = 'మహా మృత్యుంజయ హోమం' WHERE name LIKE '%Mrityunjaya%';
UPDATE homams SET name_te = 'నవగ్రహ హోమం' WHERE name LIKE '%Navagraha%';
UPDATE homams SET name_te = 'ధన్వంతరి ఆయుష్షు హోమం' WHERE name LIKE '%Dhanvantari%';
UPDATE homams SET name_te = 'లక్ష్మీ కుబేర హోమం' WHERE name LIKE '%Lakshmi Kubera%';
UPDATE homams SET name_te = 'రుద్ర హోమం' WHERE name LIKE '%Rudra%';
UPDATE homams SET name_te = 'గృహప్రవేశ వాస్తు హోమం' WHERE name LIKE '%Vastu%' OR name LIKE '%Gruhapravesham%';
UPDATE homams SET name_te = 'గాయత్రీ హోమం' WHERE name LIKE '%Gayatri%';

-- Populate Products Telugu names
UPDATE products SET name_te = 'సంపూర్ణ సత్యనారాయణ స్వామి పూజా కిట్' WHERE name LIKE '%Satyanarayana%';
UPDATE products SET name_te = 'వేద ఆవు నెయ్యి దీపపు వత్తులు (100 వత్తుల ప్యాక్)' WHERE name LIKE '%Cow Ghee Diya Wicks%';
UPDATE products SET name_te = 'సాంప్రదాయ కేరళ ఇత్తడి నిలవిళక్కు దీపం (12 అంగుళాలు)' WHERE name LIKE '%Nilavilakku%';
UPDATE products SET name_te = 'స్వచ్ఛమైన సేంద్రీయ గోమూత్ర హవన్ కప్పులు (12 కప్పులు)' WHERE name LIKE '%Havan Cups%';
UPDATE products SET name_te = 'ప్రీమియం మైసూర్ చందనం పేస్ట్ & అష్టగంధం కాంబో' WHERE name LIKE '%Sandalwood Paste%';
UPDATE products SET name_te = 'ఒరిజినల్ 5 ముఖి నేపాల్ రుద్రాక్ష జపమాల (108 పూసలు)' WHERE name LIKE '%5 Mukhi Nepal Rudraksha%';
UPDATE products SET name_te = 'చేతితో తయారుచేసిన ఇత్తడి గణపతి విగ్రహం (హోమ్ పూజా)' WHERE name LIKE '%Ganesha Murti%';
UPDATE products SET name_te = 'సంపూర్ణ మహాలక్ష్మి దీపావళి పూజా కిట్' WHERE name LIKE '%Diwali Pooja Kit%' OR name LIKE '%Mahalakshmi%';
