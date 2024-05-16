# Especificações

# pass.in

O pass.in é uma aplicação de **gestão de participantes em eventos presenciais**.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos funcionais

- [✔️]  O organizador deve poder cadastrar um novo evento;
- [✔️]  O organizador deve poder visualizar dados de um evento;
- [✔️]  O organizador deve poder visualizar a lista de participantes;
- [✔️]  O participante deve poder se inscrever em um evento;
- [✔️]  O participante deve poder visualizar seu crachá de inscrição;
- [✔️]  O participante deve poder realizar check-in no evento;

### Regras de negócio

- [✔️]  O participante só pode se inscrever em um evento uma única vez;
- [✔️]  O participante só pode se inscrever em eventos com vagas disponíveis;
- [✔️]  O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [ ]  O check-in no evento será realizado através de um QRCode;

## Especificações da API

[Swagger UI](https://nlw-unite-nodejs.onrender.com/docs/static/index.html)

## Banco de dados

Nessa aplicação vamos utilizar banco de dados relacional (SQL). Para ambiente de desenvolvimento seguiremos com o SQLite pela facilidade do ambiente.

### Estrutura do banco (SQL)

```sql
CREATE TABLE IF NOT EXISTS tb_event (
  event_id UUID,
  title VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  details VARCHAR(255),
  maximum_attendees INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT tb_event_pkey PRIMARY KEY (event_id),
  CONSTRAINT tb_event_title_key UNIQUE (title),
  CONSTRAINT tb_event_slug_key UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS tb_user (
  user_id UUID,
  name VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT tb_user_pkey PRIMARY KEY(user_id),
  CONSTRAINT tb_user_email_key UNIQUE (email),
  CONSTRAINT tb_user_username_key UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS tb_event_user(
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT tb_event_user_pkey PRIMARY KEY(event_id, user_id),
  CONSTRAINT tb_event_user_event_id_fkey
    FOREIGN KEY(event_id)
      REFERENCES tb_event(event_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT tb_event_user_user_id_fkey
    FOREIGN KEY(user_id)
      REFERENCES tb_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_check_in(
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT tb_check_in_pkey PRIMARY KEY(event_id, user_id),
  CONSTRAINT tb_check_in_event_id_fkey
    FOREIGN KEY(event_id)
      REFERENCES tb_event(event_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT tb_check_in_user_id_fkey
    FOREIGN KEY(user_id)
      REFERENCES tb_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);
```