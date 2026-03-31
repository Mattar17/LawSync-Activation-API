# LawSync Activation API

Backend API responsible for handling **license validation and activation** for the LawSync desktop application.
This service verifies license keys, activates licenses for specific machines, and issues **cryptographically signed licenses** used by the desktop client.

Although the API was initially built only for the **LawSync desktop activation system**, it is designed to be extended to support the **LawSync SaaS platform** in the future.

---

# Features

* License key validation
* Machine-based license activation
* Free trial generation
* Cryptographically signed licenses
* MongoDB license storage
* Built with TypeScript and Express
* Designed to integrate with the LawSync desktop application

---

# Tech Stack

* **Node.js**
* **Express**
* **TypeScript**
* **MongoDB**

---

# Project Purpose

The API acts as a **license authority server** for the LawSync desktop software.

The desktop application communicates with this API to:

* Validate license keys
* Activate licenses for a specific machine
* Request trial licenses
* Receive a signed license used locally by the application

This prevents unauthorized activation and ensures that each license is tied to a specific machine.

---

# License Flow

### Paid Activation Flow

1. User enters a license key in the desktop application
2. Desktop app validates the license key with the API
3. The application sends its `machineId`
4. The API attaches the machine ID to the license
5. The license is signed using the server's **private key**
6. The signed license is returned to the desktop application

---

### Trial Flow

1. Desktop application requests a trial license using its `machineId`
2. The API checks whether a trial already exists for that machine
3. If not, a new trial license is created
4. The license is signed
5. The signed license is returned to the desktop application

---

# API Documentation

Full endpoint documentation and request examples are available here:

**Postman Documentation:**
`<test>`

---

# Environment Variables

Create a `.env` file in the project root:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
PRIVATE_KEY=your_private_key_for_license_signing
```

---

# Installation

Clone the repository:

```
git clone https://github.com/yourusername/LawSync-Activation-API.git
cd LawSync-Activation-API
```

Install dependencies:

```
npm install
```

Generate a private key used for signing licenses:
```
openssl genrsa -out private.pem 2048
```

Place the generated private.pem file in the root directory of the project.


Run development server:

```
npm run dev
```

Build for production:

```
npm run build
npm start
```

---

# Security

* Licenses are **cryptographically signed**
* Desktop application verifies the signature using the **public key**
* Prevents tampering with license files
* Machine binding prevents license sharing

---

# Future Plans

This API will be extended to support the **LawSync SaaS platform**, including:

* User authentication
* Lawyer accounts
* Case management
* Online client portals
* Subscription management

---

# License

This project is part of the **LawSync ecosystem**.
