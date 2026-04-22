import React from 'react';
import { Github, Linkedin } from 'lucide-react';

// Custom Threads icon (same as Header)
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.108-1.152 3.555-1.218 1.036-.047 2.009.04 2.905.258-.08-.986-.396-1.74-.941-2.246-.603-.56-1.517-.858-2.72-.885l-.036 2.12.036-2.12c-1.894.042-3.291.543-4.036 1.447-.672.816-.977 1.94-.906 3.343.075 1.476.702 2.639 1.814 3.36.977.633 2.251.916 3.584.8 1.063-.095 1.888-.478 2.453-1.14.515-.603.86-1.428 1.03-2.458-.69-.16-1.425-.242-2.192-.242-.25 0-.503.01-.76.028-.966.072-1.759.307-2.294.68-.467.326-.694.747-.66 1.22.034.476.35.888.892 1.158.543.271 1.261.385 2.018.345 1.236-.065 2.184-.498 2.818-1.286.555-.69.894-1.637 1.012-2.82l2.116.248c-.168 1.44-.624 2.654-1.36 3.608-.99 1.286-2.418 2.053-4.244 2.282-.66.083-1.338.087-2.01.013-.836-.093-1.621-.315-2.317-.66-1.063-.527-1.867-1.32-2.328-2.295-.485-1.026-.69-2.205-.604-3.45.1-1.482.558-2.734 1.362-3.725 1.016-1.25 2.54-1.92 4.531-1.993l.065-.002c1.478.042 2.64.443 3.45 1.194.806.748 1.29 1.814 1.44 3.169.845.207 1.6.508 2.256.9 1.114.667 1.94 1.568 2.453 2.68.762 1.65.842 4.28-1.174 6.251-1.79 1.75-4.007 2.543-7.07 2.567Z"/>
  </svg>
);

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/kedbin', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kedbin/', icon: Linkedin },
  { name: 'Threads', href: 'https://www.threads.com/@relearn.ing', icon: ThreadsIcon }
];

export const Footer = () => (
  <footer className="border-t border-border/50 py-12 text-center md:text-left">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} relearn.ing
        </p>
        <p className="text-muted/60 text-xs mt-1">
          Built in public with honest metrics.
        </p>
      </div>
      <div className="flex gap-5 text-muted">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors"
          >
            <link.icon className="w-4 h-4" />
          </a>
        ))}
      </div>
    </div>
  </footer>
);
