import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata = {
  title: 'LeetProb',
  description:
    'A curated collection of probability problems for interview prep — with full solutions.',
  openGraph: {
    title: 'LeetProb',
    description:
      'Practice probability problems with detailed solutions. Great for quant, data science, and SWE interviews.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6SMTL9RVR9" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6SMTL9RVR9');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
