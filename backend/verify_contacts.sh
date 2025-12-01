#!/bin/bash

BASE_URL="http://localhost:3000"
EMAIL="testadmin@example.com"
PASSWORD="password123"

# 1. Setup Admin (might fail if admin exists)
echo "Setting up Admin..."
curl -s -X POST $BASE_URL/auth/setup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Admin\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

# 2. Register (might fail if exists)
echo "Registering..."
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Admin\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

# 2. Login
echo "Logging in..."
TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed"
  exit 1
fi

echo "Token: $TOKEN"

# 3. Create Contact
echo "Creating Contact..."
CONTACT_ID=$(curl -s -X POST $BASE_URL/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890"}' | grep -o '"id":[^,]*' | cut -d':' -f2)

echo "Contact ID: $CONTACT_ID"

if [ -z "$CONTACT_ID" ]; then
  echo "Create Contact failed"
  exit 1
fi

# 4. Get All Contacts
echo "Getting All Contacts..."
curl -s -X GET $BASE_URL/contacts \
  -H "Authorization: Bearer $TOKEN"

# 5. Get Contact By ID
echo "Getting Contact By ID..."
curl -s -X GET $BASE_URL/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN"

# 6. Update Contact
echo "Updating Contact..."
curl -s -X PUT $BASE_URL/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe Updated"}'

# 7. Delete Contact
echo "Deleting Contact..."
curl -s -X DELETE $BASE_URL/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN"

echo "Done"
