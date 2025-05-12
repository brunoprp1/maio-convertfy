import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MessageSquare, Send, FileText, HelpCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <HelpCircle className="h-8 w-8 text-gray-400" />
        <h1 className="text-2xl font-semibold">Suporte</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="flex items-start gap-4 p-6">
          <div className="bg-green-100 p-3 rounded-lg">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-4">
              Fale com nossa equipe via WhatsApp para suporte imediato
            </p>
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="primary">Iniciar Conversa</Button>
            </a>
          </div>
        </Card>

        <Card className="flex items-start gap-4 p-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Send className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium mb-2">Formulário de Contato</h3>
            <p className="text-sm text-gray-500 mb-4">
              Envie sua mensagem e retornaremos em até 24h
            </p>
            <Button 
              variant="primary"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Enviar Mensagem
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="text-lg font-medium mb-4">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {[
            {
              question: 'Como melhorar a taxa de abertura dos meus emails?',
              answer: 'Para melhorar a taxa de abertura, foque em: 1) Linhas de assunto atrativas e personalizadas; 2) Segmentação adequada da lista; 3) Horários de envio otimizados; 4) Testes A/B regulares; 5) Manutenção da lista de contatos atualizada.'
            },
            {
              question: 'Qual a diferença entre campanhas de WhatsApp e SMS?',
              answer: 'WhatsApp permite mensagens mais ricas com imagens, vídeos e botões interativos, ideal para engajamento. SMS é mais direto e tem maior alcance, perfeito para notificações importantes e ofertas rápidas. Cada canal tem suas vantagens dependendo do objetivo da campanha.'
            },
            {
              question: 'Como evitar que meus emails caiam na caixa de spam?',
              answer: 'Para evitar o spam: 1) Use autenticação SPF e DKIM; 2) Mantenha lista de contatos limpa; 3) Evite palavras que disparam filtros de spam; 4) Tenha uma boa proporção texto/imagem; 5) Permita fácil descadastramento; 6) Mantenha engajamento consistente.'
            },
            {
              question: 'Qual o melhor horário para enviar mensagens?',
              answer: 'O melhor horário varia conforme seu público. Para e-commerce, geralmente: Emails entre 10h e 11h ou 15h e 16h; WhatsApp entre 12h e 14h ou 18h e 20h; SMS em horários comerciais. Recomendamos testar diferentes horários e analisar as métricas.'
            },
            {
              question: 'Como personalizar minhas campanhas?',
              answer: 'Use dados do cliente como nome, últimas compras e comportamento de navegação. Nossa plataforma permite segmentação avançada e campos dinâmicos para criar mensagens altamente personalizadas em todos os canais.'
            },
            {
              question: 'Como medir o ROI das minhas campanhas?',
              answer: 'Nossa plataforma rastreia conversões através de UTMs e pixels. Você pode ver métricas como taxa de abertura, cliques, conversões e receita gerada por campanha, além de comparar o desempenho entre diferentes canais.'
            }
          ].map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-lg"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium">{faq.question}</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Card>

      <Card id="contact-form">
        <h2 className="text-lg font-medium mb-4">Formulário de Contato</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assunto
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione um assunto</option>
              <option value="technical">Suporte Técnico</option>
              <option value="billing">Faturamento</option>
              <option value="feature">Sugestão de Funcionalidade</option>
              <option value="integration">Integrações</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          <Button type="submit" variant="primary">
            Enviar Mensagem
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Support;