'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { generateProductsFileContent } from '@/lib/adminProducts';
import type { Product } from '@/types';

export function ExportPanel({ products, onReset }: { products: Product[]; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const content = generateProductsFileContent(products);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.ts';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-handloom flex flex-col gap-4 rounded-sm p-6 shadow-zari sm:p-8">
      <div>
        <h2 className="font-serif text-xl text-maroon">Publish these changes</h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-earth">
          Everything above is saved only in this browser. To make it visible to real visitors,
          replace <code>lib/products.ts</code> with the code below, then commit and deploy — ask
          Claude to do this for you, or paste it in yourself.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={copy}>
          {copied ? 'Copied!' : 'Copy code'}
        </Button>
        <Button type="button" variant="ghost" onClick={download}>
          Download products.ts
        </Button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Discard every local change and revert to the published products?')) {
              onReset();
            }
          }}
          className="ml-auto font-sans text-xs uppercase tracking-wide text-maroon underline"
        >
          Reset to published defaults
        </button>
      </div>

      <pre className="max-h-96 overflow-auto rounded-sm border border-gold/30 bg-charcoal/95 p-4 font-mono text-xs leading-relaxed text-cream-100">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export default ExportPanel;
