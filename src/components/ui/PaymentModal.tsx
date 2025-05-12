import React, { useState } from 'react';
import { X, CreditCard, Barcode, QrCode } from 'lucide-react';
import Button from './Button';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    value: number;
    dueDate: string;
  };
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, transaction }) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'boleto' | 'pix'>('credit');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with Asaas API
    console.log('Payment submitted:', { paymentMethod, cardData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Realizar Pagamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Valor:</span>
              <span className="text-lg font-semibold">
                R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vencimento:</span>
              <span>{transaction.dueDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('credit')}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                paymentMethod === 'credit' ? 'border-[#0066FF] bg-blue-50' : 'border-gray-200'
              }`}
            >
              <CreditCard size={24} className={paymentMethod === 'credit' ? 'text-[#0066FF]' : 'text-gray-500'} />
              <span className={`text-sm ${paymentMethod === 'credit' ? 'text-[#0066FF]' : 'text-gray-500'}`}>
                Cartão de Crédito
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod('boleto')}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                paymentMethod === 'boleto' ? 'border-[#0066FF] bg-blue-50' : 'border-gray-200'
              }`}
            >
              <Barcode size={24} className={paymentMethod === 'boleto' ? 'text-[#0066FF]' : 'text-gray-500'} />
              <span className={`text-sm ${paymentMethod === 'boleto' ? 'text-[#0066FF]' : 'text-gray-500'}`}>
                Boleto
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod('pix')}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                paymentMethod === 'pix' ? 'border-[#0066FF] bg-blue-50' : 'border-gray-200'
              }`}
            >
              <QrCode size={24} className={paymentMethod === 'pix' ? 'text-[#0066FF]' : 'text-gray-500'} />
              <span className={`text-sm ${paymentMethod === 'pix' ? 'text-[#0066FF]' : 'text-gray-500'}`}>
                PIX
              </span>
            </button>
          </div>

          {paymentMethod === 'credit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nome impresso no cartão"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade
                  </label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcelas
                </label>
                <select
                  value={cardData.installments}
                  onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}x {i === 0 ? 'de R$ ' + transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 
                      'de R$ ' + (transaction.value / (i + 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      {i <= 5 ? ' sem juros' : ' com juros'}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" variant="primary" fullWidth>
                Pagar com Cartão
              </Button>
            </form>
          )}

          {paymentMethod === 'boleto' && (
            <div className="text-center space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  O boleto será gerado e enviado para seu email. O prazo de compensação é de até 3 dias úteis.
                </p>
              </div>
              <Button variant="primary" fullWidth onClick={handleSubmit}>
                Gerar Boleto
              </Button>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div className="text-center space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  O QR Code do PIX será gerado instantaneamente. O pagamento é processado em poucos segundos.
                </p>
              </div>
              <Button variant="primary" fullWidth onClick={handleSubmit}>
                Gerar QR Code PIX
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;