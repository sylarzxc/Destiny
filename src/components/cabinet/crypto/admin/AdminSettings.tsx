import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Shield, Bell, Mail, Database, Globe } from 'lucide-react';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Platform Settings</h1>
        <p className="text-purple-400">Configure platform-wide settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {[
            { icon: Settings, label: 'General', active: true },
            { icon: Shield, label: 'Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Mail, label: 'Email Templates', active: false },
            { icon: Database, label: 'Database', active: false },
            { icon: Globe, label: 'API Settings', active: false },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white'
                    : 'text-purple-400 hover:bg-purple-800/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-purple-300">Platform Name</Label>
                  <Input defaultValue="DESTINY" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Platform Description</Label>
                  <Textarea 
                    defaultValue="Crypto staking platform with high APY rates"
                    className="bg-purple-900/30 border-purple-700 text-white"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Support Email</Label>
                  <Input defaultValue="hello@destiny.io" type="email" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Timezone</Label>
                  <select className="w-full bg-purple-900/30 border border-purple-700 text-white rounded-lg px-4 py-2">
                    <option>UTC+0</option>
                    <option>UTC+2 (EET)</option>
                    <option>UTC-5 (EST)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Platform Features */}
          <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-6">Platform Features</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'New User Registrations', description: 'Allow new users to register', enabled: true },
                  { label: 'Staking', description: 'Enable staking functionality', enabled: true },
                  { label: 'Withdrawals', description: 'Allow users to withdraw funds', enabled: true },
                  { label: 'Referral Program', description: 'Enable referral system', enabled: true },
                  { label: 'Leaderboard', description: 'Show public leaderboard', enabled: true },
                  { label: 'Maintenance Mode', description: 'Put platform in maintenance', enabled: false },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                    <div>
                      <div className="text-white mb-1">{feature.label}</div>
                      <div className="text-purple-400 text-sm">{feature.description}</div>
                    </div>
                    <Switch defaultChecked={feature.enabled} />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Fee Settings */}
          <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-6">Fee Configuration</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Staking Fee (%)</Label>
                  <Input type="number" defaultValue="2.5" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Withdrawal Fee (%)</Label>
                  <Input type="number" defaultValue="0.5" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Early Withdrawal Penalty (%)</Label>
                  <Input type="number" defaultValue="5.0" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Referral Commission (%)</Label>
                  <Input type="number" defaultValue="10.0" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-6">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                  <div>
                    <div className="text-white mb-1">Two-Factor Authentication</div>
                    <div className="text-purple-400 text-sm">Require 2FA for admin accounts</div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                  <div>
                    <div className="text-white mb-1">IP Whitelist</div>
                    <div className="text-purple-400 text-sm">Restrict admin access by IP</div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300">Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="30" className="bg-purple-900/30 border-purple-700 text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Save All Settings
            </Button>
            <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-800/50">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
