import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "../api";

interface Book {
  id: number;
  title: string;
  author?: { name: string };
  category?: { name: string };
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({ title: "", author_id: "", category_id: "" });

  const fetchBooks = async () => {
    const res = await api.get("/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/books", form);
    setForm({ title: "", author_id: "", category_id: "" });
    fetchBooks();
  };

  const deleteBook = async (id: number) => {
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Libros</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="author_id"
          placeholder="ID Autor"
          value={form.author_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="category_id"
          placeholder="ID Categoría"
          value={form.category_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Título</th>
            <th className="border px-2 py-1">Autor</th>
            <th className="border px-2 py-1">Categoría</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border px-2 py-1">{book.id}</td>
              <td className="border px-2 py-1">{book.title}</td>
              <td className="border px-2 py-1">{book.author?.name}</td>
              <td className="border px-2 py-1">{book.category?.name}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => deleteBook(book.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
