import React, { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp, Award, Share2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import confetti from 'canvas-confetti';

type Achievement = {
  id: string;
  milestone: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const Rewards: React.FC = () => {
  const [currentRevenue, setCurrentRevenue] = useState(75000); // Mock data
  const [showCongrats, setShowCongrats] = useState(false);
  const [lastUnlockedAchievement, setLastUnlockedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: '50k',
      milestone: 50000,
      icon: <Trophy className="h-8 w-8" />,
      title: 'Primeiro Marco',
      description: 'Alcançou R$ 50.000 em faturamento atribuído',
      unlocked: currentRevenue >= 50000,
      unlockedAt: '15/03/2025',
    },
    {
      id: '100k',
      milestone: 100000,
      icon: <Trophy className="h-8 w-8" />,
      title: 'Crescimento Constante',
      description: 'Alcançou R$ 100.000 em faturamento atribuído',
      unlocked: currentRevenue >= 100000,
    },
    {
      id: '250k',
      milestone: 250000,
      icon: <Star className="h-8 w-8" />,
      title: 'Parceiro Prata',
      description: 'Alcançou R$ 250.000 em faturamento atribuído',
      unlocked: currentRevenue >= 250000,
    },
    {
      id: '500k',
      milestone: 500000,
      icon: <Star className="h-8 w-8" />,
      title: 'Parceiro Ouro',
      description: 'Alcançou R$ 500.000 em faturamento atribuído',
      unlocked: currentRevenue >= 500000,
    },
    {
      id: '1m',
      milestone: 1000000,
      icon: <Award className="h-8 w-8" />,
      title: 'Primeiro Milhão',
      description: 'Alcançou R$ 1.000.000 em faturamento atribuído',
      unlocked: currentRevenue >= 1000000,
    },
    {
      id: '5m',
      milestone: 5000000,
      icon: <Award className="h-8 w-8" />,
      title: 'Parceiro Diamante',
      description: 'Alcançou R$ 5.000.000 em faturamento atribuído',
      unlocked: currentRevenue >= 5000000,
    },
    {
      id: '10m',
      milestone: 10000000,
      icon: <Award className="h-8 w-8" />,
      title: 'Parceiro Elite',
      description: 'Alcançou R$ 10.000.000 em faturamento atribuído',
      unlocked: currentRevenue >= 10000000,
    },
    {
      id: '15m',
      milestone: 15000000,
      icon: <Award className="h-8 w-8" />,
      title: 'Parceiro Lendário',
      description: 'Alcançou R$ 15.000.000 em faturamento atribuído',
      unlocked: currentRevenue >= 15000000,
    },
  ];

  const getNextMilestone = () => {
    const nextAchievement = achievements.find(a => !a.unlocked);
    return nextAchievement?.milestone || achievements[achievements.length - 1].milestone;
  };

  const calculateProgress = () => {
    const nextMilestone = getNextMilestone();
    const previousMilestone = achievements
      .filter(a => a.unlocked)
      .slice(-1)[0]?.milestone || 0;
    
    const progress = ((currentRevenue - previousMilestone) / (nextMilestone - previousMilestone)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getProgressMessage = () => {
    const nextMilestone = getNextMilestone();
    const remaining = nextMilestone - currentRevenue;
    return `Faltam ${formatCurrency(remaining)} para conquistar sua próxima plaquinha!`;
  };

  const handleShare = (achievement: Achievement) => {
    const text = `🏆 Conquistei a plaquinha "${achievement.title}" na Convertfy! ${achievement.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Conquista Convertfy',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      // Show toast or notification that text was copied
    }
  };

  useEffect(() => {
    // Simulate checking for newly unlocked achievements
    const lastUnlocked = achievements
      .filter(a => a.unlocked)
      .slice(-1)[0];
    
    if (lastUnlocked && !showCongrats) {
      setLastUnlockedAchievement(lastUnlocked);
      setShowCongrats(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5947FD', '#10B981', '#F59E0B']
      });
      
      setTimeout(() => setShowCongrats(false), 5000);
    }
  }, [currentRevenue]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-8 w-8 text-[#5947FD]" />
        <div>
          <h1 className="text-2xl font-semibold">Minhas Conquistas Convertfy</h1>
          <p className="text-gray-500">
            A cada novo marco de faturamento, você desbloqueia uma premiação exclusiva!
          </p>
        </div>
      </div>

      {/* Journey Map */}
      <div className="relative mb-8 px-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-[#5947FD] -translate-y-1/2 transition-all duration-1000"
          style={{ width: `${calculateProgress()}%` }}
        />
        
        <div className="relative grid grid-cols-4 md:grid-cols-8 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.id}
              className={`flex flex-col items-center ${
                achievement.unlocked ? 'text-[#5947FD]' : 'text-gray-400'
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center z-10
                transition-all duration-300
                ${achievement.unlocked 
                  ? 'bg-[#5947FD] text-white' 
                  : 'bg-gray-200 text-gray-400'
                }
                ${currentRevenue >= achievement.milestone * 0.9 && !achievement.unlocked
                  ? 'animate-pulse'
                  : ''
                }
              `}>
                {achievement.icon}
              </div>
              <p className="mt-2 text-xs font-medium text-center">
                {formatCurrency(achievement.milestone)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">Faturamento Atual</p>
              <p className="text-2xl font-bold text-[#5947FD]">
                {formatCurrency(currentRevenue)}
              </p>
            </div>
            <p className="text-sm text-gray-500">{getProgressMessage()}</p>
          </div>

          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[#5947FD] rounded-full transition-all duration-1000"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`relative overflow-hidden transition-all duration-300 ${
              achievement.unlocked 
                ? 'border-[#5947FD] bg-gradient-to-br from-white to-blue-50'
                : 'opacity-75 grayscale'
            }`}
          >
            {achievement.unlocked && (
              <>
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Conquistado
                  </span>
                </div>
                <button
                  onClick={() => handleShare(achievement)}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-[#5947FD] transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </>
            )}

            <div className={`p-4 flex flex-col items-center text-center ${
              achievement.unlocked ? 'text-[#5947FD]' : 'text-gray-400'
            }`}>
              {achievement.icon}
              <h3 className="mt-4 font-semibold">{achievement.title}</h3>
              <p className="mt-2 text-sm">
                {achievement.description}
              </p>
              <p className="mt-4 font-bold">
                {formatCurrency(achievement.milestone)}
              </p>
              {achievement.unlockedAt && (
                <p className="mt-2 text-xs text-gray-500">
                  Conquistado em {achievement.unlockedAt}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {showCongrats && lastUnlockedAchievement && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-[#5947FD] animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="text-[#5947FD]">
              {lastUnlockedAchievement.icon}
            </div>
            <div>
              <p className="font-medium">Parabéns! 🎉</p>
              <p className="text-sm text-gray-600">
                Você desbloqueou a conquista {lastUnlockedAchievement.title}!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;