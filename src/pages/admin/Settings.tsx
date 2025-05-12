import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Set light theme as default if no theme is set
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    }

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <SettingsIcon className="h-8 w-8 text-gray-400 dark:text-dark-400" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-900">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 p-0">
          <nav className="flex flex-col">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-50 ${
                activeTab === 'notifications' ? 'bg-gray-50 dark:bg-dark-50 border-l-4 border-[#0066FF]' : ''
              }`}
            >
              <Bell size={20} className={activeTab === 'notifications' ? 'text-[#0066FF]' : 'text-gray-400 dark:text-dark-400'} />
              <span className={activeTab === 'notifications' ? 'text-[#0066FF] font-medium' : 'text-gray-600 dark:text-dark-600'}>
                Notificações
              </span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-50 ${
                activeTab === 'security' ? 'bg-gray-50 dark:bg-dark-50 border-l-4 border-[#0066FF]' : ''
              }`}
            >
              <Shield size={20} className={activeTab === 'security' ? 'text-[#0066FF]' : 'text-gray-400 dark:text-dark-400'} />
              <span className={activeTab === 'security' ? 'text-[#0066FF] font-medium' : 'text-gray-600 dark:text-dark-600'}>
                Segurança
              </span>
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-50 ${
                activeTab === 'integrations' ? 'bg-gray-50 dark:bg-dark-50 border-l-4 border-[#0066FF]' : ''
              }`}
            >
              <Globe size={20} className={activeTab === 'integrations' ? 'text-[#0066FF]' : 'text-gray-400 dark:text-dark-400'} />
              <span className={activeTab === 'integrations' ? 'text-[#0066FF] font-medium' : 'text-gray-600 dark:text-dark-600'}>
                Integrações
              </span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-50 ${
                activeTab === 'appearance' ? 'bg-gray-50 dark:bg-dark-50 border-l-4 border-[#0066FF]' : ''
              }`}
            >
              <Palette size={20} className={activeTab === 'appearance' ? 'text-[#0066FF]' : 'text-gray-400 dark:text-dark-400'} />
              <span className={activeTab === 'appearance' ? 'text-[#0066FF] font-medium' : 'text-gray-600 dark:text-dark-600'}>
                Aparência
              </span>
            </button>
          </nav>
        </Card>

        <Card className="md:col-span-3">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-dark-900">Preferências de Notificação</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-900">Email</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-500">Receba notificações por email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-[#0066FF]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-900">Push</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-500">Notificações no navegador</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-[#0066FF]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-900">WhatsApp</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-500">Receba notificações via WhatsApp</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-[#0066FF]"></div>
                  </label>
                </div>
              </div>

              <Button variant="primary">Salvar Preferências</Button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-dark-900">Segurança da Conta</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900"
                  />
                </div>

                <Button variant="primary">Alterar Senha</Button>
              </form>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-dark-900">Integrações</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-900">API Key</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-500">Chave para integração com outras plataformas</p>
                  </div>
                  <Button variant="outline">Gerar Nova Chave</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-900">Webhooks</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-500">Configure URLs para receber notificações</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-dark-900">Aparência</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                    Tema
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                    Densidade
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900">
                    <option>Confortável</option>
                    <option>Compacto</option>
                  </select>
                </div>

                <Button variant="primary">Salvar Preferências</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Settings;