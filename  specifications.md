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
- [ ]  O participante deve poder se inscrever em um evento;
- [ ]  O participante deve poder visualizar seu crachá de inscrição;
- [ ]  O participante deve poder realizar check-in no evento;

### Regras de negócio

- [ ]  O participante só pode se inscrever em um evento uma única vez;
- [ ]  O participante só pode se inscrever em eventos com vagas disponíveis;
- [ ]  O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [ ]  O check-in no evento será realizado através de um QRCode;

## Especificações da API

[Swagger UI](https://nlw-unite-nodejs.onrender.com/docs/static/index.html)

## Banco de dados

Nessa aplicação vamos utilizar banco de dados relacional (SQL). Para ambiente de desenvolvimento seguiremos com o SQLite pela facilidade do ambiente.

### Estrutura do banco (SQL)

```sql
CREATE TABLE IF NOT EXISTS event(
    event_id UUID,
    title VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    details VARCHAR(255),
    maximum_attendees INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT event_pkey PRIMARY KEY (event_id),
    CONSTRAINT event_title_key UNIQUE (title),
    CONSTRAINT event_slug_key UNIQUE (slug)
);
CREATE TABLE IF NOT EXISTS attendee(
    attendee_id UUID,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    event_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT attendee_pkey PRIMARY KEY(attendee_id),
    CONSTRAINT attendee_email_key UNIQUE (email),
    CONSTRAINT event_id_fkey
        FOREIGN KEY(event_id) 
            REFERENCES event(event_id)
);
CREATE TABLE IF NOT EXISTS check_in(
    check_in_id UUID,
    attendee_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    event_id UUID NOT NULL,
    CONSTRAINT check_in_pkey PRIMARY KEY(check_in_id),
    CONSTRAINT attendee_id_fkey
        FOREIGN KEY(attendee_id) 
            REFERENCES attendee(attendee_id)
            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT event_id_fkey
        FOREIGN KEY(event_id) 
            REFERENCES event(event_id)
            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT check_in_attendee_id_event_id_unique
        UNIQUE (attendee_id, event_id)                        
);
```