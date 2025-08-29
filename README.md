# 🧩 EvalEase

EvalEase is a training feedback collection portal designed to gather and analyze participant feedback after training sessions.
It helps Capability or L\&D teams evaluate training effectiveness and continuously improve content and delivery.

The platform enables administrators to create custom feedback forms for different training types and track responses.


## 🔧 Tech Stack

### 🖥 Frontend

* **React (Vite)**
* **TypeScript**
* **Tailwind CSS**

### 🔙 Backend (Java)

* **Spring Boot**
* **Maven** (build management)
* **MySQL** (via Docker/mysql on local device)
* **JPA/Hibernate** (ORM)
* **DTOs + Entity Mapping**

### 🐍 Python Sentiment analysis 

* Runs on **Flask/FastAPI** (port `5000`) for analytics/ML modules


## ⚙️ Features

* ✅ Dynamic Forms supporting:

  * Rating Scale
  * Text Input / TextArea
  * Multiple Choice
  * Checkboxes
* 🧪 Live form preview before saving
* 💾 Save form with all questions to backend
* 🐬 Auto-generate MySQL schema at startup
* 🔒 DTO layer to prevent direct entity exposure


## 🚀 Installation & Setup

### 1️⃣ Clone Repo

```bash
git clone https://github.com/Abheeshta-P/EvalEase.git
cd evalease
```


### 2️⃣ Backend (Spring Boot – Port **8080**)

1. Update **`src/main/resources/application.properties`**:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/evalease
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   ```

2. Build & Run:

   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Runs on 👉 `http://localhost:8080`


### 3️⃣ Database (MySQL in Docker – Port **3306**)

Start MySQL using Docker:

```bash
docker run --name evalease-mysql -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=evalease -p 3306:3306 -d mysql:8
```


### 4️⃣ Frontend (React – Port **8081**)

1. Go to frontend:

   ```bash
   cd frontend
   ```

2. Create **`.env`** file:

   ```bash
   VITE_SERVER_PORT=http://localhost:8080
   ```

3. Install deps & run:

   ```bash
   npm install
   npm run dev 
   ```

   Runs on 👉 `http://localhost:8081`


### 5️⃣ Analysis in python (API at **5000**)

If you have an ML/analytics service:

```bash
cd feedback-sentiment-api
pip install -r requirements.txt
python app.py
```

Runs on 👉 `http://localhost:5000`


## 🔑 Admin Login (default)

* **Email**: `admin@evalease.com`
* **Password**: `adminpass`

(You can later change this as per company requirements.)


## ⚠️ Notes

* Backend auto-generates schema (`ddl-auto=update`).
* Admin credentials are hardcoded only for development.
* Docker MySQL container must be running before backend start (If docker is used to run the mysql).

## 📸 Screenshots

| Feature / Screen                 | Screenshot(s) |
|----------------------------------|---------------|
| Admin Login                      | <img width="1920" height="906" alt="adminlogin" src="https://github.com/user-attachments/assets/ec875dca-6947-45c8-a6cb-e6d133eeb968" />|
| Admin Dashboard                  | <img width="1920" height="906" alt="admin dashboard" src="https://github.com/user-attachments/assets/a4af2ad0-820b-4eba-a88d-a76adedc2b48" />|
| Form Creation   | <img width="1920" height="906" alt="form create1" src="https://github.com/user-attachments/assets/19b69eb8-ae4f-4db0-9a54-b995df6c843c" />
| Form preview                     | <img width="1920" height="1449" alt="form preview" src="https://github.com/user-attachments/assets/9d76df05-d982-405a-abcf-e923ca0a84eb" />|
| Employee Login                   | <img width="1920" height="906" alt="employeelogin" src="https://github.com/user-attachments/assets/192114b0-e984-4c76-a5c4-b661635ed72b" />|
| Employee Dashboard (before filling form) | <img width="1920" height="906" alt="employee dashhboard" src="https://github.com/user-attachments/assets/20713df9-2602-4907-ac2b-9ee6f953ce71" />|
| Filling the Form                 | <img width="1920" height="1505" alt="fill form" src="https://github.com/user-attachments/assets/0cace49f-9aed-434e-a965-863e2e4bede5" />
| Employee Dashboard (after filling form)               | <img width="1920" height="906" alt="employee dashboard" src="https://github.com/user-attachments/assets/fdd31beb-efc9-49e0-9251-e3418b93d62e" />|
| Analytics (overall)   | <img width="1920" height="2017" alt="main" src="https://github.com/user-attachments/assets/ba8b869a-8726-42b7-ad8f-1c4a6d163adc" />|
|Analytics (per form) | <img width="1920" height="3670" alt="form" src="https://github.com/user-attachments/assets/0d934d04-b0cc-4404-b3a4-643d798d906e" />|

