import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "../api";

interface Author {
  id: number;
  name: string;
  books?: { id: number; title: string }[];
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState({ name: "" });

  const fetchAuthors = async () => {
    const res = await api.get("/authors");
    setAuthors(res.data);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/authors", form);
    setForm({ name: "" });
    fetchAuthors();
  };

  const deleteAuthor = async (id: number) => {
    await api.delete(`/authors/${id}`);
    fetchAuthors();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Autores</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Nombre del autor"
          value={form.name}
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
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Libros</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td className="border px-2 py-1">{author.id}</td>
              <td className="border px-2 py-1">{author.name}</td>
              <td className="border px-2 py-1">
                {author.books?.map((b) => b.title).join(", ")}
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => deleteAuthor(author.id)}
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
