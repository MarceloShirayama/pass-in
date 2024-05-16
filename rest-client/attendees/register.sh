#!/bin/bash

base_url="http://localhost:3333"

# Crie um novo usuário
route="/attendees/register"

# Defina os valores dos campos no corpo da requisição
name="any name"
email="any_email@mail.com"
username="any-username"
password="anyPassword*1"

# Converta as variáveis em um formato JSON válido
data=$(\
jq -n \
--arg name "$name" \
--arg email "$email" \
--arg username "$username" \
--arg password "$password" \
'{name: $name, email: $email, username: $username, password: $password}'\
)

# Faça a requisição POST usando o httpie
http POST $base_url$route <<< "$data"