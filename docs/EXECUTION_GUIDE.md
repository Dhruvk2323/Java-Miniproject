# Step-by-Step Execution Guide
## SpendWise - Full Stack Java Expense Tracker

Follow these instructions to run the application smoothly on your local machine for development, testing, or lab demonstration.

---

## 1. Prerequisites
1. **Java Development Kit (JDK)**: JDK 17 or JDK 21 installed.
2. **Node.js**: Node.js 18+ and npm installed.
3. **Database Options**:
   - **Option A (Default - MySQL)**: MySQL Server running locally on port `3306`.
   - **Option B (Zero Setup - H2 In-Memory)**: Runs immediately without needing MySQL installed!

---

## 2. Quick Start (Windows One-Click)
You can launch both the backend and frontend simultaneously by double-clicking the included batch script:
- Double click: `run-all.bat` in the project root directory.

Or run them individually via the steps below:

---

## 3. Running the Backend (Spring Boot)

### Step 3.1: Configure MySQL (Optional if using MySQL)
1. Open MySQL Command Line or MySQL Workbench.
2. Run the script in `database/schema.sql`:
   ```sql
   source /path/to/database/schema.sql;
   source /path/to/database/data.sql;
   ```
3. Set your MySQL root password:
   - Either edit `backend/src/main/resources/application.properties` directly:
     ```properties
     spring.datasource.password=your_root_password
     ```
   - Or run with your password in the terminal:
     ```powershell
     $env:DB_PASSWORD="your_root_password"; mvn spring-boot:run
     ```

### Step 3.2: Launch the Spring Boot Server
Open a terminal in the `backend/` directory:
```powershell
cd backend
mvn spring-boot:run
```
*(The backend starts on `http://localhost:8080`)*

> **Tip for Viva/Instant Demo (Using H2 In-Memory Database)**:  
> If MySQL is not running or you do not remember the root password, run with the `h2` profile:
> ```powershell
> mvn spring-boot:run -Dspring-boot.run.profiles=h2
> ```
> In H2 mode, all sample data is preloaded in RAM instantly, and the H2 console is available at `http://localhost:8080/h2-console`.

---

## 4. Running the Frontend (React Vite SPA)

Open a second terminal in the `frontend/` directory:
```powershell
cd frontend
npm install
npm run dev
```
*(The React application starts on `http://localhost:5173`)*

---

## 5. Verifying the Full Stack Application
1. Open your browser and navigate to: **`http://localhost:5173`**
2. **Dashboard**: View overall budget utilization, summary cards, and category breakdown.
3. **All Expenses**: Filter by category, search by title or payment method, and export to CSV.
4. **Add Expense**: Record a new transaction with live field validation.
5. **Reports**: View detailed analytics and the lab observation table.

---

## 6. Testing REST Endpoints via Postman / Browser
- `GET http://localhost:8080/api/dashboard/stats`
- `GET http://localhost:8080/api/expenses`
- `GET http://localhost:8080/api/categories`
- `POST http://localhost:8080/api/expenses`
  - Body:
    ```json
    {
      "title": "College Cafeteria Lunch",
      "amount": 180.0,
      "categoryId": 1,
      "expenseDate": "2026-10-28",
      "paymentMethod": "UPI",
      "notes": "South Indian thali"
    }
    ```
