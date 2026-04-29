# SafeHer Architecture

## Overview
SafeHer is a women safety mobile application that provides real-time emergency alerts with location sharing.

## Components

### Frontend
- React Native (Expo)
- SOS Button
- Location tracking

### Backend
- Node.js + Express
- REST APIs

### Database
- PostgreSQL (Supabase)

### Email System
- Nodemailer (Gmail SMTP)

## Flow

User → Press SOS  
→ Get Location  
→ Send to Backend  
→ Save in Database  
→ Send Email Alerts  

## Technologies
- React Native
- Node.js
- Supabase
- Nodemailer