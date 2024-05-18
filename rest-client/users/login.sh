#!/bin/bash

base_url="http://localhost:3333"

route="/users/login"

username="organizer"
password="OrganizerPassword*1"

data=$(\
jq -n \
--arg username $username \
--arg password $password \
'{username: $username, password: $password}'\
)

http POST $base_url$route <<< "$data"