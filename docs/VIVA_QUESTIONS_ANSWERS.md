# Viva Voce Preparation Guide: Full Stack Java Mini Project
### Subject: Java Programming & Web Technologies Laboratory (`CE-JWP-LAB`)
### Scheme: `DB25-V1` | Academic Year: 2026-27

This document compiles comprehensive, technically rigorous answers to the theoretical, conceptual, and viva voce questions directly aligned with the experiments in your laboratory manual.

---

## 1. Spring Boot & Architecture (Exp 12 & Mini Project)

### Q1: What makes this application "monolithic" as opposed to a microservices-based design?
**Answer**:
A **monolithic application** packages all functional components (User management, Categories, Expenses, Dashboard calculations) into a single unified deployment unit (one Spring Boot JAR file) that runs within a single process and accesses a single database.
- *Trade-offs*: Monoliths are simpler to develop, test, debug, and deploy initially.
- *Contrast*: A microservices architecture decomposes these domains into independent, loosely-coupled services communicating over HTTP/gRPC or message queues (e.g., Kafka/RabbitMQ), each with its own database. Microservices offer isolated scalability and fault isolation at the expense of distributed complexity (network latency, distributed transactions, service discovery).

### Q2: Explain the role of each layer: Entity, Repository, Service, Controller.
**Answer**:
- **Entity (`model`)**: Represents the persistent domain model mapped directly to relational database tables using JPA annotations (`@Entity`, `@Table`, `@Id`). It encapsulates data structure and validation constraints (`@Positive`, `@NotBlank`).
- **Repository (`repository`)**: The Data Access Object (DAO) layer extending Spring Data JPA's `JpaRepository`. It abstracts database operations, generating SQL queries at runtime without boilerplate code.
- **Service (`service`)**: Contains the core business logic, business rule validations (e.g., budget threshold calculation), and transaction boundaries (`@Transactional`). It isolates business rules from HTTP transport details.
- **Controller (`controller`)**: The API presentation layer annotated with `@RestController`. It exposes HTTP endpoints (GET, POST, PUT, DELETE), handles request parameter extraction and validation (`@Valid`), and serializes domain objects into JSON HTTP responses.

### Q3: How does Spring Data JPA generate repository implementations without SQL code?
**Answer**:
Spring Data JPA uses Java dynamic proxies and bytecode generation at runtime. When Spring's IoC container starts up, it scans for interfaces extending `JpaRepository`. It dynamically creates proxy classes that intercept method calls.
For method names adhering to Spring conventions (like `findByCategoryIdOrderByExpenseDateDesc`), Spring parses the method name keywords (`findBy`, `OrderBy`, `Desc`) into an Abstract Syntax Tree (AST) and translates it into JPQL/SQL executed by Hibernate. Custom queries are written using `@Query` annotations.

### Q4: Why is Constructor Injection preferred over Field Injection (`@Autowired`)?
**Answer**:
1. **Immutability**: Dependencies can be declared `final`, ensuring they cannot be reassigned after construction.
2. **Testability**: In unit tests, dependencies can be passed directly via `new ExpenseService(mockRepo, ...)` without requiring reflection, Spring test runners, or mockito injectors.
3. **Prevention of NullPointerExceptions**: Constructor injection guarantees that an object cannot be instantiated in an incomplete, uninitialized state.
4. **Circular Dependency Detection**: Spring catches circular dependencies at startup when using constructor injection rather than failing silently or causing runtime issues.

### Q5: What is the difference between `@RestController` and `@Controller`?
**Answer**:
- `@Controller` is the traditional Spring MVC annotation designed to return a view name (such as a JSP or Thymeleaf template) resolved by a `ViewResolver`.
- `@RestController` is a convenience annotation combining `@Controller` and `@ResponseBody`. It indicates that every handler method's return value is written directly to the HTTP response body as JSON/XML using an `HttpMessageConverter` (Jackson), making it the standard choice for RESTful web services.

### Q6: What is the purpose of `@ControllerAdvice` and `@ExceptionHandler`?
**Answer**:
`@ControllerAdvice` (or `@RestControllerAdvice`) acts as an interceptor for exceptions thrown across all controllers. Instead of leaking raw Java stack traces (HTTP 500) to clients, methods annotated with `@ExceptionHandler` catch specific exceptions (like `ResourceNotFoundException` or `MethodArgumentNotValidException`) and transform them into standardized, clean JSON error responses with appropriate HTTP status codes (404, 400).

---

## 2. React & Front-End SPA (Exp 11 & Mini Project)

### Q7: What is a Single Page Application (SPA), and how does React Router avoid full page reloads?
**Answer**:
In a traditional multi-page application, clicking a link causes the browser to send an HTTP request to the web server, which sends back an entirely new HTML document, causing a blank screen flash and full document re-render.
In a React SPA, the browser loads a single HTML shell (`index.html`) once. React Router uses the HTML5 History API (`pushState` and `popState` events) to manipulate the browser URL and history stack client-side without sending a network request for a new page. React Router then conditionally mounts and renders the matching component in the DOM.

### Q8: What is the difference between `props` and `state` in React?
**Answer**:
- **Props (Properties)**: Passed from a parent component down to a child component (unidirectional top-down data flow). Props are **read-only** (immutable) from the child component's perspective.
- **State**: An internal, encapsulated data store managed directly within the component using the `useState` hook. State is **mutable** via its setter function (`setExpenses`), and updating state triggers a component re-render.

### Q9: What is the Virtual DOM and how does React reconcile UI updates?
**Answer**:
The Virtual DOM is a lightweight, in-memory JavaScript representation of the actual browser DOM. When component state changes:
1. React creates a new Virtual DOM tree.
2. It executes a "diffing" algorithm (**Reconciliation**) to compare the new Virtual DOM tree against the previous snapshot.
3. It computes the minimum set of changes required and applies only those specific batch updates to the real browser DOM. This avoids costly full-tree browser layout recalculations and repaints.

### Q10: Why must React Hooks (`useState`, `useEffect`) be called only at the top level?
**Answer**:
React relies on the **order in which Hooks are called** to associate local state variables with the component across consecutive render cycles. If hooks were placed inside `if` statements, loops, or nested functions, the execution order could change between renders, causing React to mismatch state variables with their respective values.

---

## 3. Database, JDBC & Security (Exp 6, Exp 9, Exp 10)

### Q11: Why does `PreparedStatement` prevent SQL Injection, while Statement with string concatenation does not?
**Answer**:
- In `Statement` with string concatenation (`"SELECT * FROM users WHERE username='" + user + "'"`), the SQL query structure and user data are sent to the database engine as a single merged string. A malicious input like `' OR '1'='1` alters the SQL parser's syntax tree, changing the query logic.
- With `PreparedStatement`, the database pre-compiles the SQL template containing parameter placeholders (`?`). When parameter values are bound via `ps.setString(1, user)`, the database engine treats those parameters strictly as literal literal data values, never as executable SQL code.

### Q12: What is the cause of CORS (Cross-Origin Resource Sharing) errors during integration?
**Answer**:
The **Same-Origin Policy** enforced by web browsers restricts web pages from making AJAX/fetch requests to a different domain, protocol, or port than the one that served the web page.
During development, the React dev server runs on `http://localhost:5173`, while the Spring Boot backend runs on `http://localhost:8080` — differing port numbers constitute different origins. The browser blocks responses unless the backend explicitly includes the header `Access-Control-Allow-Origin: http://localhost:5173` (configured via `@CrossOrigin` or `WebMvcConfigurer`). Tools like Postman or curl do not enforce this policy because they are not web browsers.

### Q13: What is the difference between client-side and server-side validation?
**Answer**:
- **Client-Side Validation** (e.g., JavaScript regex checks on form submit): Provides immediate visual feedback to the user without a network round-trip, improving user experience. However, it can easily be bypassed by disabling JavaScript or sending requests directly via Postman.
- **Server-Side Validation** (e.g., Spring Boot `@Valid`, `@Positive`, `@NotBlank`): The definitive line of security defense that guarantees data integrity before database insertion regardless of client origin. Both must always be used together in production systems.
