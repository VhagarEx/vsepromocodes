-- SQLite schema from the applied Django migrations.
PRAGMA foreign_keys = ON;

BEGIN;
CREATE TABLE "accounts_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "password" varchar(128) NOT NULL, "last_login" datetime NULL, "is_superuser" bool NOT NULL, "username" varchar(150) NOT NULL UNIQUE, "first_name" varchar(150) NOT NULL, "last_name" varchar(150) NOT NULL, "is_staff" bool NOT NULL, "is_active" bool NOT NULL, "date_joined" datetime NOT NULL, "full_name" varchar(160) NOT NULL, "email" varchar(254) NOT NULL UNIQUE);

CREATE TABLE "promos_store" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "slug" varchar(50) NOT NULL UNIQUE, "name" varchar(100) NOT NULL, "coupons_name" varchar(100) NOT NULL, "logo" varchar(120) NOT NULL);

CREATE TABLE "promos_offer" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "type" varchar(4) NOT NULL, "discount" varchar(32) NOT NULL, "title" varchar(150) NOT NULL, "terms" text NOT NULL, "expires" date NOT NULL, "code" varchar(64) NOT NULL, "url" varchar(200) NOT NULL, "store_id" bigint NOT NULL REFERENCES "promos_store" ("id") DEFERRABLE INITIALLY DEFERRED, CONSTRAINT "offer_code_or_link" CHECK ((("type" = 'code' AND "url" = '' AND NOT ("code" = '')) OR ("code" = '' AND "type" = 'link' AND NOT ("url" = '')))));

CREATE TABLE "promos_report" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "comment" text NOT NULL, "status" varchar(11) NOT NULL, "created_at" datetime NOT NULL, "offer_id" bigint NOT NULL REFERENCES "promos_offer" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" bigint NOT NULL REFERENCES "accounts_user" ("id") DEFERRABLE INITIALLY DEFERRED, CONSTRAINT "report_known_status" CHECK ("status" IN ('new', 'in_progress', 'done')));

CREATE UNIQUE INDEX "user_email_unique_ci" ON "accounts_user" ((LOWER("email")));

CREATE INDEX "promos_offer_store_id_96723434" ON "promos_offer" ("store_id");

CREATE INDEX "promos_report_offer_id_91083e27" ON "promos_report" ("offer_id");

CREATE INDEX "promos_report_user_id_627ea65b" ON "promos_report" ("user_id");
COMMIT;
