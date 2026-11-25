# ER-диаграмма каталога

```mermaid
erDiagram
    promos_store ||--o{ promos_offer : "публикует"

    promos_store {
        integer id PK
        varchar(50) slug UK
        varchar(100) name
        varchar(100) coupons_name
        varchar(120) logo
    }

    promos_offer {
        integer id PK
        bigint store_id FK
        varchar(4) type
        varchar(32) discount
        varchar(150) title
        text terms
        date expires
        varchar(64) code
        varchar(200) url
    }
```

У магазина может быть несколько предложений или ни одного. У каждого предложения ровно один магазин. Внешний ключ `store_id` ссылается на `promos_store.id` и индексируется. Django защищает магазин от удаления, пока с ним связаны предложения.

У промокода `type = code` заполнено поле `code`, а у акции `type = link` заполнено поле `url`. Второе поле содержит пустую строку. Это правило проверяют и серверная форма, и ограничение `offer_code_or_link` в SQLite.

[SQL-схема каталога](schema.sql) сгенерирована из миграции `promos.0001_initial`. Django создаёт собственные служебные таблицы и модель пользователя отдельными миграциями.
