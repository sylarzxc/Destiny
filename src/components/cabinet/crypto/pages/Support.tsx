import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Mail, FileText, HelpCircle, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'How does staking work?',
      answer: 'Staking allows you to deposit your cryptocurrency for a set period and earn rewards. Your crypto is locked during the staking period, and you receive interest based on the APY rate.'
    },
    {
      question: 'What are the minimum deposit amounts?',
      answer: 'Minimum deposits vary by cryptocurrency: ETH - 0.1, BNB - 0.5, USDT - 100, ADA - 50, MATIC - 100. Check each asset for specific requirements.'
    },
    {
      question: 'Can I withdraw before the lock period ends?',
      answer: 'Yes, but early withdrawal incurs a 5% penalty fee. It\'s best to complete the full staking period to maximize your rewards.'
    },
    {
      question: 'How are rewards calculated?',
      answer: 'Rewards are calculated based on your deposit amount, the APY rate, and the staking period. You can see estimated rewards before confirming your stake.'
    },
    {
      question: 'Is my crypto safe?',
      answer: 'Yes, we use industry-standard security measures including cold storage, multi-signature wallets, and regular security audits to protect your assets.'
    },
    {
      question: 'How does the referral program work?',
      answer: 'Share your unique referral link with friends. When they sign up and stake, you earn 10% commission on their staking rewards forever.'
    },
  ];

  const tickets = [
    { id: '#12345', subject: 'Withdrawal Issue', status: 'In Progress', date: '2024-02-15', priority: 'High' },
    { id: '#12344', subject: 'Staking Question', status: 'Resolved', date: '2024-02-10', priority: 'Low' },
    { id: '#12343', subject: 'Account Verification', status: 'Resolved', date: '2024-02-05', priority: 'Medium' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Ticket submitted successfully', {
      description: 'Our support team will get back to you within 24 hours.'
    });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Support Center</h1>
        <p className="text-slate-400">Get help with your account and staking questions</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-support-live-chat border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer">
          <div className="p-6 text-center">
            <MessageCircle className="text-blue-400 mx-auto mb-3" size={32} />
            <h3 className="text-white mb-2">Live Chat</h3>
            <p className="text-slate-400 text-sm">Chat with our support team</p>
          </div>
        </Card>

        <Card className="bg-support-email border-green-500/30 backdrop-blur-sm hover:border-green-500/50 transition-all cursor-pointer">
          <div className="p-6 text-center">
            <Mail className="text-green-400 mx-auto mb-3" size={32} />
            <h3 className="text-white mb-2">Email Support</h3>
            <p className="text-slate-400 text-sm">support@destiny.io</p>
          </div>
        </Card>

        <Card className="bg-support-docs border-purple-500/30 backdrop-blur-sm hover:border-purple-500/50 transition-all cursor-pointer">
          <div className="p-6 text-center">
            <FileText className="text-purple-400 mx-auto mb-3" size={32} />
            <h3 className="text-white mb-2">Documentation</h3>
            <p className="text-slate-400 text-sm">Read our guides</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submit Ticket */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Send className="text-blue-400" size={20} />
                <h2 className="text-white">Submit a Ticket</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subject</Label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Message</Label>
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Priority</Label>
                  <select className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-4 py-2">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  Submit Ticket
                </Button>
              </form>
            </div>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="text-purple-400" size={20} />
                <h2 className="text-white">Frequently Asked Questions</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-white hover:text-blue-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Card>
        </div>

        {/* Your Tickets */}
        <div className="space-y-6">
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-orange-400" size={20} />
                <h3 className="text-white">Your Tickets</h3>
              </div>

              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-blue-400 text-sm">{ticket.id}</div>
                        <div className="text-white">{ticket.subject}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.status === 'Resolved' 
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{ticket.date}</span>
                      <span className={`${
                        ticket.priority === 'High' ? 'text-red-400' :
                        ticket.priority === 'Medium' ? 'text-orange-400' :
                        'text-slate-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-white mb-4">Contact Information</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Email</div>
                  <div>support@destiny.io</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Response Time</div>
                  <div>Usually within 24 hours</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Support Hours</div>
                  <div>24/7 Live Chat Available</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
