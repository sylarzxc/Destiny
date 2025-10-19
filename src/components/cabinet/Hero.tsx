import { Button } from '../ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full">
              🚀 Інноваційні рішення для бізнесу
            </div>
            <h1 className="text-gray-900">
              Створюємо майбутнє разом з вами
            </h1>
            <p className="text-gray-600 max-w-lg">
              Ми допомагаємо компаніям трансформувати їхній бізнес за допомогою 
              передових технологій та інноваційних рішень. Почніть свій шлях до успіху сьогодні.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                Розпочати
                <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Play size={18} />
                Дивитись демо
              </Button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-blue-600">500+</div>
                <div className="text-gray-600">Клієнтів</div>
              </div>
              <div>
                <div className="text-blue-600">98%</div>
                <div className="text-gray-600">Задоволених</div>
              </div>
              <div>
                <div className="text-blue-600">24/7</div>
                <div className="text-gray-600">Підтримка</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MDU2MjQ5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern workspace"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <div className="text-gray-900">+2,500</div>
                  <div className="text-gray-600">Проектів завершено</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
