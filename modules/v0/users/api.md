## Comprehensive guide for file storage (image,pdf) on hyperledger

### 1. User APIs

#### 1a. Create New user

- POST request to `http://localhost:8080/api/v0/user`

- Expected input is
- It will add email(unique) and a pdf file (sample.pdf) already in our directory

```json
    {
        "email": "composer@gmail.com",
        "type" : "pdf"
    }
```

- It will add email(unique) and a jpg file (sample.jpg) already in our directory

```json
    {
        "email": "composer@gmail.com",
        "type" : "jpg"
    }
```

- Expected output is

```json
   {
        "message": "User has been added successfully",
        "dev_message": "Success"
    }
```

#### 1b. Queries  user

- GET request to `http://localhost:8080/api/v0/user/:id`

- Expected output is

```json
   {
    "message": "User has been retrieved successfully",
    "dev_message": "Success",
    "user": {
        "$class": "org.example.biznet.User",
        "email": "composer@gmail.com",
        "image": "base64................long  string"
    }
   }
```
