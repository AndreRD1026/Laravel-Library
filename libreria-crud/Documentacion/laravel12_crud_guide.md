# 📘 Guía de USO para CRUD con Laravel 12 + React (Inertia.js)

## 🚀 1. Crear el proyecto

```bash
laravel new library-crud
```

---

## 🗂️ 2. Configurar base de datos (SQLite)

Laravel ya crea el archivo `database/database.sqlite`.  
Verificar en `.env`:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/project/database/database.sqlite
```

---

## 🛠️ 3. Crear modelos, migraciones y controladores

### Books
```bash
php artisan make:model Book -mcr
```
### Authors
```bash
php artisan make:model Author -mcr
```
### Categories
```bash
php artisan make:model Category -mcr
```

📌 **Flags usadas**:
- `-m` → genera la **migración**
- `-c` → genera el **controlador**
- `-r` → controlador con métodos RESTful (CRUD básico)

---

## 🏗️ 4. Definir migraciones

Ejemplo `database/migrations/xxxx_create_books_table.php`:

```php
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->foreignId('author_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});
```

Ejecutar migraciones:

```bash
php artisan migrate
```

---

## 🎛️ 5. Definir controladores CRUD

Ejemplo `BookController.php`:

```php
public function index() {
    return response()->json(Book::with(['author', 'category'])->get());
}

public function store(Request $request) {
    $validated = $request->validate([
        'title' => 'required|string',
        'author_id' => 'required|exists:authors,id',
        'category_id' => 'required|exists:categories,id',
    ]);
    return response()->json(Book::create($validated), 201);
}
```

⚡ Lo mismo se hace con `AuthorController` y `CategoryController`.

---

## 🌐 6. Configurar rutas API

En **Laravel 12** hay que registrar manualmente `api.php`.  
Editar `bootstrap/app.php`:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

Crear archivo `routes/api.php`:

```php
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::apiResource('books', BookController::class);
Route::apiResource('authors', AuthorController::class);
Route::apiResource('categories', CategoryController::class);
```

---

## 📡 7. Probar API con Postman

Ejemplos:
- `GET /api/books` → listar libros
- `POST /api/books` → crear libro (body JSON)
```json
{
  "title": "Laravel for Beginners",
  "author_id": 1,
  "category_id": 2
}
```

- `DELETE /api/books/{id}` → eliminar libro

---

## 🎨 8. Frontend con React + Inertia + TSX

### Cliente API (`resources/js/api.ts`)
```ts
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
```

### Página Books (`resources/js/Pages/Books.tsx`)
Ejemplo resumido:
```tsx
import { useEffect, useState } from "react";
import api from "../api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    api.get("/books").then(res => setBooks(res.data));
  }, []);

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/books", { title, author_id: 1, category_id: 1 });
    const res = await api.get("/books");
    setBooks(res.data);
    setTitle("");
  };

  return (
    <div>
      <h1>Books</h1>
      <form onSubmit={addBook}>
        <input value={title} onChange={e => setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {books.map((b: any) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Registrar ruta Inertia (`routes/web.php`)
```php
Route::get('/books', function () {
    return Inertia::render('Books');
})->name('books');
```

---

## 🖥️ 9. Levantar los servidores

Pruebas siempre levantar ambos:

```bash
php artisan serve   # servidor Laravel (API y rutas)
npm run dev         # servidor Vite (JS/CSS con hot reload)
```
---

# Finalizado
