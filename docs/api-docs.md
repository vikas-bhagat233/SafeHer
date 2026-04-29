# API Documentation

## Base URL
http://192.168.0.104:3000/api

---

## AUTH

### Signup
POST /auth/signup

Body:
{
  "name": "Vikas",
  "email": "vikas@gmail.com",
  "password": "1234"
}

---

### Login
POST /auth/login

---

## CONTACTS

### Add Contact
POST /contact/add

### Get Contacts
GET /contact/:user_id

---

## ALERT

### Send Alert
POST /alert/send

Body:
{
  "user_id": 1,
  "location": "Google Maps link",
  "contacts": ["email1@gmail.com"]
}