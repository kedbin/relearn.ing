import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from './Logo';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/kedbin', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kedbin/', icon: Linkedin },
  { name: 'Twitter', href: 'https://x.com/relearn_ing', icon: Twitter }
];

export const Footer = () => (
  <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center md:text-left">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <Logo />
        <p className="text-slate-500 text-sm mt-2">
          © {new Date().getFullYear()} relearn.ing. Built in public with honest metrics.
        </p>
        <a href="mailto:hello@relearn.ing" className="text-brand-300 text-sm hover:text-brand-200 transition-colors">
          hello@relearn.ing
        </a>
      </div>
      <div className="flex gap-5 text-slate-400">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-400 transition-colors"
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  </footer>
);
