#!/bin/bash

base_url="http://localhost:3333"

# Crie um novo evento
route="/events/register"

# Defina os valores dos campos no corpo da requisição
title='any title',
details='any details',
maximumAttendees=10

# Converta as variáveis em um formato JSON válido
data=$(\
jq -n \
--arg title "$title" \
--arg details "$details" \
--arg maximumAttendees $maximumAttendees \
'{title: $title, details: $details, maximumAttendees: $maximumAttendees}'\
)

token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiYWMxOGFlLTY2ZDktNGY3YS1hMWQzLWUxY2ZlYWVjMDFjNiIsImlhdCI6MTcxNjAzNzY0NywiZXhwIjoxNzE2MTI0MDQ3fQ.kIt7FfrOk6n4euSAsYWBhYxIxUa6Fe-Reg5FTK-dgdg"

# Faça a requisição POST usando o httpie
http POST $base_url$route -A bearer -a $token  <<< "$data"