# LawSync Backend API

Backend API powering the **LawSync ecosystem**, including the SaaS platform and desktop application.

🌐 **Main SaaS Website:** https://lawsync-saas.vercel.app/

This API is responsible for handling **lawyers, cases, authentication, search functionality**, and **desktop license activation**, all in a unified system designed to scale.

---

# Features

* Lawyer management (CRUD operations)
* Case management system
* Advanced case search functionality
* Authentication system (Admin & Lawyers)
* Secure password hashing
* Uploading and storing lawyer avatars
* Desktop license activation & validation
* Free trial generation for desktop app
* Cryptographically signed licenses
* Sync cases from desktop application to SaaS platform using lawyer token
* Built with TypeScript and Express
* Integrated with Supabase

---

# Tech Stack

* **Node.js**
* **Express**
* **TypeScript**
* **Supabase** (Database, Storage, Auth support)

---

# Project Purpose

This API serves as the **core backend** for both:

### 1. LawSync SaaS Platform

Handles:

* Lawyer accounts
* Case management
* Authentication (Admin & Lawyers)
* Searching and filtering cases
* File and avatar uploads

### 2. LawSync Desktop Application

Handles:

* License validation
* Machine-based activation
* Trial generation
* Signed license issuance
* Syncing locally stored cases to the SaaS platform

---

# Core Functionalities

## Authentication

* Role-based authentication system:

  * Admin
  * Lawyers
* Passwords are securely hashed before storage
* Lawyer token is used to authorize desktop-to-server communication

---

## Lawyers & Cases

* Manage lawyers and their data
* Create, update, and track legal cases
* Search cases efficiently using filters and queries

---

## Case Sync (Desktop → SaaS)

* Desktop app authenticates using the **lawyer token**
* Sends locally stored cases to the API
* API validates ownership and merges/saves cases in the database
* Ensures consistency between desktop and web platforms

---

## File Uploads

* Upload and store lawyer avatars using Supabase storage

---

## Desktop Activation System

### Paid Activation Flow

1. User enters a license key in the desktop application
2. Desktop app sends the key to the API
3. The application provides its `machineId`
4. The API binds the license to that machine
5. The license is signed using the server's **private key**
6. A signed license is returned to the desktop application

---

### Trial Flow

1. Desktop application requests a trial license using `machineId`
2. API checks if a trial already exists
3. If not, a trial license is created
4. The license is signed
5. Signed license is returned

---

# API Documentation

Full endpoint documentation:

**Postman Docs:**
https://documenter.getpostman.com/view/38403808/2sBXinHWS3

---

# Environment Variables

Create a `.env` file:

```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_or_service_key
PRIVATE_KEY=your_private_key_for_license_signing
```

---

# Installation

Clone the repository:

```
git clone https://github.com/yourusername/LawSync-Backend.git
cd LawSync-Backend
```

Install dependencies:

```
npm install
```

Generate a private key for license signing:

```
openssl genrsa -out private.pem 2048
```

Place `private.pem` in the root directory.

---

# Running the Project

Development:

```
npm run dev
```

Production:

```
npm run build
npm start
```

---

# Security

* Passwords are **securely hashed**
* Licenses are **cryptographically signed**
* Desktop app verifies licenses using a **public key**
* Machine binding prevents license sharing
* Secure handling of authentication and user roles

---

# Future Plans

* Subscription and billing system
* Role-based permissions expansion
* Notifications system
* Realtime updates (cases & activities)
* Full SaaS scaling with microservices architecture

---

# License

Part of the **LawSync ecosystem**.
