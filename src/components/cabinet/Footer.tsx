import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Особливості', href: '#features' },
      { name: 'Ціни', href: '#pricing' },
      { name: 'Демо', href: '#demo' },
      { name: 'Оновлення', href: '#updates' },
    ],
    company: [
      { name: 'Про нас', href: '#about' },
      { name: 'Блог', href: '#blog' },
      { name: 'Кар\'єра', href: '#careers' },
      { name: 'Контакти', href: '#contact' },
    ],
    resources: [
      { name: 'Документація', href: '#docs' },
      { name: 'Підтримка', href: '#support' },
      { name: 'API', href: '#api' },
      { name: 'Спільнота', href: '#community' },
    ],
    legal: [
      { name: 'Конфіденційність', href: '#privacy' },
      { name: 'Умови', href: '#terms' },
      { name: 'Cookies', href: '#cookies' },
      { name: 'Ліцензії', href: '#licenses' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-white mb-4">
              TechFlow
            </div>
            <p className="text-gray-400 mb-6">
              Створюємо інноваційні рішення для вашого бізнесу. Разом до успіху.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white mb-4">Продукт</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white mb-4">Компанія</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white mb-4">Ресурси</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white mb-4">Правова інформація</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2025 TechFlow. Всі права захищені.
            </p>
            <p className="text-gray-400">
              Зроблено з ❤️ в Україні
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
