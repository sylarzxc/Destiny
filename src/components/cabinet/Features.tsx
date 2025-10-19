import React from 'react';
import { Zap, Shield, Users, Rocket, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

export function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Швидкість',
      description: 'Блискавично швидкі рішення, які прискорюють ваш бізнес.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Shield,
      title: 'Безпека',
      description: 'Найвищий рівень захисту ваших даних та конфіденційності.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Users,
      title: 'Командна робота',
      description: 'Ефективна співпраця в реальному часі для вашої команди.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Rocket,
      title: 'Інновації',
      description: 'Використання найсучасніших технологій для вашого успіху.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Clock,
      title: 'Автоматизація',
      description: 'Економте час з розумною автоматизацією процесів.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: TrendingUp,
      title: 'Аналітика',
      description: 'Глибокі інсайти для прийняття кращих бізнес-рішень.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full mb-4">
            Наші переваги
          </div>
          <h2 className="text-gray-900 mb-4">
            Все, що потрібно для успіху
          </h2>
          <p className="text-gray-600">
            Ми пропонуємо комплексні рішення, які допомагають вашому бізнесу 
            рости та досягати нових висот.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-2 hover:border-blue-200 transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`${feature.color}`} size={24} />
                  </div>
                  <h3 className="text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
