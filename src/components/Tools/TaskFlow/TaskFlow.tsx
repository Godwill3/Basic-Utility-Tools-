import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle, Plus, Trash2, Tag, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'Work' | 'Personal' | 'Urgent';
}

export const TaskFlow: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<Task['category']>('Personal');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('procalc_tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('procalc_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      category
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const getCategoryColor = (c: Task['category']) => {
    if (c === 'Urgent') return '#ff4b2b';
    if (c === 'Work') return '#00d2ff';
    return '#ffa000';
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
        <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ChevronLeft size={24} />
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <CheckCircle size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>TaskFlow</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '4px 16px',
            border: '1px solid var(--glass-border)',
            alignItems: 'center',
            gap: '12px'
          }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                padding: '12px 0',
                outline: 'none',
                fontSize: '1rem',
                flex: 1
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}
            >
              <Plus size={24} />
            </motion.button>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {(['Work', 'Personal', 'Urgent'] as const).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  background: category === c ? `${getCategoryColor(c)}22` : 'rgba(255,255,255,0.05)',
                  color: category === c ? getCategoryColor(c) : 'var(--text-secondary)',
                  border: '1px solid transparent',
                  borderColor: category === c ? getCategoryColor(c) : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </form>

        <div style={{ 
          marginTop: '8px',
          display: 'flex',
          borderBottom: '1px solid var(--glass-border)',
          gap: '24px'
        }}>
          {['All', 'Active', 'Completed'].map(f => (
            <button
               key={f}
               onClick={() => setFilter(f as any)}
               style={{
                 background: 'none',
                 border: 'none',
                 padding: '12px 4px',
                 color: filter === f ? 'white' : 'var(--text-secondary)',
                 borderBottom: filter === f ? '2px solid var(--accent-color)' : '2px solid transparent',
                 cursor: 'pointer',
                 fontSize: '0.9rem',
                 fontWeight: filter === f ? '600' : '400',
                 transition: 'all 0.2s'
               }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
           <AnimatePresence>
             {filteredTasks.map(task => (
               <motion.div
                 key={task.id}
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 style={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: '16px',
                   padding: '16px',
                   background: 'rgba(255, 255, 255, 0.03)',
                   borderRadius: '16px',
                   border: '1px solid var(--glass-border)'
                 }}
               >
                 <motion.button
                   whileTap={{ scale: 0.8 }}
                   onClick={() => toggleTask(task.id)}
                   style={{ background: 'none', border: 'none', color: task.completed ? 'var(--accent-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
                 >
                   {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                 </motion.button>
                 
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ 
                      fontSize: '1rem', 
                      color: task.completed ? 'var(--text-secondary)' : 'white',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {task.text}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: getCategoryColor(task.category),
                      fontWeight: '600'
                    }}>
                      {task.category}
                    </span>
                 </div>

                 <button
                   onClick={() => deleteTask(task.id)}
                   style={{ background: 'none', border: 'none', color: '#ff4b2b', opacity: 0.5, cursor: 'pointer' }}
                 >
                   <Trash2 size={18} />
                 </button>
               </motion.div>
             ))}
           </AnimatePresence>
           
           {filteredTasks.length === 0 && (
             <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
               No tasks found
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};
