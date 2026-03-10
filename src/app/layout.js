import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata = {
  title: 'Probability Interview Questions',
  description:
    'A curated collection of probability problems for interview prep — with full solutions.',
  openGraph: {
    title: 'Probability Interview Questions',
    description:
      'Practice probability problems with detailed solutions. Great for quant, data science, and SWE interviews.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
