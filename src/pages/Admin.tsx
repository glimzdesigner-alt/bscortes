import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';
import { LogOut, Plus, Trash2 } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'fabrics'>('services');

  const [services, setServices] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);

  // Form states
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', iconName: 'Scissors' });
  const [fabricForm, setFabricForm] = useState({ name: '', desc: '' });

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const sSnap = await getDocs(collection(db, 'services'));
      setServices(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const fSnap = await getDocs(collection(db, 'fabrics'));
      setFabrics(fSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'services/fabrics');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      // Força a persistência em memória ANTES do login para contornar o bloqueio de cookies do iframe
      await setPersistence(auth, inMemoryPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login Error:", error);
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setLoginError('E-mail ou senha incorretos.');
          break;
        case 'auth/invalid-email':
          setLoginError('O formato do e-mail é inválido.');
          break;
        case 'auth/user-disabled':
          setLoginError('Esta conta de usuário foi desativada.');
          break;
        case 'auth/network-request-failed':
          setLoginError('O navegador está bloqueando o login (cookies de terceiros). Tente abrir o site em uma nova guia.');
          break;
        default:
          setLoginError(`Erro ao fazer login: ${error.message || 'Tente novamente mais tarde.'}`);
      }
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'services'), serviceForm);
      setServiceForm({ title: '', description: '', iconName: 'Scissors' });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
    }
  };

  const handleAddFabric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'fabrics'), fabricForm);
      setFabricForm({ name: '', desc: '' });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'fabrics');
    }
  };

  const handleDeleteFabric = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fabrics', id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `fabrics/${id}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Painel Administrativo</h1>
          <p className="text-slate-600 mb-8">Faça login para gerenciar o conteúdo do site.</p>
          {loginError && <p className="text-red-500 mb-4 text-sm">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-900">BS Cortes - Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user.email}</span>
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors" title="Sair">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button 
            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('services')}
          >
            Serviços
          </button>
          <button 
            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'fabrics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('fabrics')}
          >
            Tecidos
          </button>
        </div>

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4">Adicionar Serviço</h2>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <input required type="text" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                  <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ícone (Nome Lucide)</label>
                  <input required type="text" value={serviceForm.iconName} onChange={e => setServiceForm({...serviceForm, iconName: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Ex: Scissors, Ruler, Layers" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {services.map(s => (
                <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{s.title} <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded ml-2">{s.iconName}</span></h3>
                    <p className="text-slate-600 text-sm mt-1">{s.description}</p>
                  </div>
                  <button onClick={() => handleDeleteService(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {services.length === 0 && <p className="text-slate-500 text-center py-8 bg-white rounded-xl border border-slate-100">Nenhum serviço cadastrado.</p>}
            </div>
          </div>
        )}

        {activeTab === 'fabrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4">Adicionar Tecido</h2>
              <form onSubmit={handleAddFabric} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input required type="text" value={fabricForm.name} onChange={e => setFabricForm({...fabricForm, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Exemplos</label>
                  <input required type="text" value={fabricForm.desc} onChange={e => setFabricForm({...fabricForm, desc: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fabrics.map(f => (
                <div key={f.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{f.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{f.desc}</p>
                  </div>
                  <button onClick={() => handleDeleteFabric(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {fabrics.length === 0 && <p className="text-slate-500 text-center py-8 col-span-2 bg-white rounded-xl border border-slate-100">Nenhum tecido cadastrado.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
