# ER-диаграмма каталога и обращений

```mermaid
erDiagram
    promos_store ||--o{ promos_offer : "содержит"
    promos_offer ||--o{ promos_report : "получает"
    accounts_user ||--o{ promos_report : "создаёт"

    accounts_user {
        integer id PK
        varchar(150) username UK
        varchar(254) email UK
        varchar(128) password
        varchar(160) full_name
        varchar(150) first_name
        varchar(150) last_name
        bool is_staff
        bool is_superuser
        bool is_active
        datetime last_login
        datetime date_joined
    }

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

    promos_report {
        integer id PK
        bigint user_id FK
        bigint offer_id FK
        text comment
        varchar(11) status
        datetime created_at
    }
```

- Еmail уникален независимо от регистра. `password` хранит хеш Django. Активный пользователь с `is_staff = true` имеет роль ADMIN. Доступ к списку обращений в Django Admin дополнительно определяется разрешениями модели.
- У каждого обращения ровно один автор и одно предложение. Пользовательский интерфейс выбирает обращения по `user_id` текущего пользователя. Статусы в базе: `new`, `in_progress`, `done`.
- Нельзя удалить предложение, пока к нему привязаны обращения. В промокоде заполнен `code`, в акции заполнен `url`.
- [SQL-схема](schema.sql) показывает четыре таблицы предметной области. Миграции Django дополнительно создают таблицы групп, разрешений, журнала администрирования и сессий.
