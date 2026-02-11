# AI WhatsApp Chatbot Admin Dashboard

A frontend-only Admin Dashboard built with Nuxt 3, Bootstrap 5, and Pinia.

## Features

- **Dashboard**: Overview of system status and metrics.
- **Customer Management**: List, Add, and View Customer details.
- **Customer Context**: Tabs for Inbox, Dataset, AI Config, and Chat Logs scoped to specific customers.
- **Responsive Design**: Mobile-friendly sidebar and layouts using Bootstrap 5.
- **Modern UI**: Global admin template style with custom SCSS, Inter font, and card-based layouts.
- **Architecture**: Service/Repository pattern with abstraction for easy API integration.
- **State Management**: Pinia stores for reactive data handling.

## Tech Stack

- **Framework**: Nuxt 3
- **UI**: Bootstrap 5 + Bootstrap Icons
- **State**: Pinia
- **Language**: TypeScript

## Project Structure

- `/components`: Reusable UI components.
- `/layouts`: Application layouts (Sidebar, etc.).
- `/pages`: Application routes.
- `/services`: Data access layer (Abstracted API calls).
- `/stores`: Pinia stores.
- `/data`: Dummy JSON data (Simulating database).
- `/types`: TypeScript interfaces.

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build**:
    ```bash
    npm run build
    ```

## Architecture Notes

### Service Layer (`/services`)
All data access goes through the service layer. Currently, services fetch data from local JSON files in `/data` to simulate an API.

**Example**: `CustomerService.getAll()` returns a `Promise<Customer[]>` from `customers.json`.

To switch to a real API, update the `BaseService` or individual service classes to make HTTP requests (e.g., using `useFetch`) instead of importing JSON. Component logic will remain unchanged.

### Store Layer (`/stores`)
Pinia stores interact with services to manage application state. Components should only access data through stores, not directly from services.

## Dummy Data
Dummy data is located in `/data/`. This is used to hydrate the application for demonstration purposes.
