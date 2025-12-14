import { useState, useEffect } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api';

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  // Sayfa açılınca verileri çek
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      alert("Backend'e bağlanılamadı! Sunucunun açık olduğundan emin ol.");
    }
  };

  // Yeni İş Ekle
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!description) return alert("Lütfen iş tanımı girin!");

    const newTodo = {
      description: description,
      assignee: assignee,
      isCompleted: false
    };

    await addTodo(newTodo);
    setDescription('');
    setAssignee('');
    fetchTodos(); // Listeyi yenile
  };

  // Tamamlandı / Devam Ediyor İşlemi
  const handleToggle = async (todo) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    await updateTodo(todo.id, updatedTodo);
    fetchTodos();
  };

  // Silme İşlemi
  const handleDelete = async (id) => {
    if (confirm("Bu işi silmek istediğine emin misin?")) {
      await deleteTodo(id);
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Başlık Alanı */}
        <div className="bg-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white text-center">To-Do Listesi</h1>
          <p className="text-blue-100 text-center mt-2">React + .NET 9 + PostgreSQL</p>
        </div>

        {/* Ekleme Formu */}
        <form onSubmit={handleAdd} className="p-6 bg-gray-50 border-b flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Yapılacak iş nedir?"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Kime atandı?"
            className="w-48 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Ekle
          </button>
        </form>

        {/* Liste */}
        <div className="p-6">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">Henüz hiç iş yok. Bir tane ekle!</p>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li 
                  key={todo.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${todo.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:shadow-md transition'}`}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={todo.isCompleted} 
                      onChange={() => handleToggle(todo)}
                      className="w-6 h-6 text-blue-600 rounded cursor-pointer"
                    />
                    <div>
                      <p className={`text-lg font-medium ${todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.description}
                      </p>
                      {todo.assignee && (
                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          👤 {todo.assignee}
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;