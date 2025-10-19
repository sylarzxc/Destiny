import { Card } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
          <div className="w-16 h-4 bg-slate-700 rounded"></div>
        </div>
        <div className="w-20 h-4 bg-slate-700 rounded mb-2"></div>
        <div className="w-32 h-8 bg-slate-700 rounded"></div>
      </div>
    </Card>
  );
}

export function SkeletonCryptoCard() {
  return (
    <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm p-4">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
            <div>
              <div className="w-12 h-4 bg-slate-700 rounded mb-1"></div>
              <div className="w-16 h-3 bg-slate-700 rounded"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-4 bg-slate-700 rounded mb-1"></div>
            <div className="w-16 h-3 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SkeletonChart() {
  return (
    <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="w-32 h-6 bg-slate-700 rounded mb-2"></div>
            <div className="w-48 h-4 bg-slate-700 rounded"></div>
          </div>
          <div className="w-24 h-8 bg-slate-700 rounded"></div>
        </div>
        <div className="h-80 bg-slate-700 rounded"></div>
      </div>
    </Card>
  );
}

export function SkeletonActivityItem() {
  return (
    <div className="animate-pulse flex items-center justify-between pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        <div>
          <div className="w-24 h-4 bg-slate-700 rounded mb-1"></div>
          <div className="w-16 h-3 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="w-20 h-4 bg-slate-700 rounded mb-1"></div>
        <div className="w-16 h-3 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

