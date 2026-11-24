'use client';

import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

export function CommandPanel({ code, title = 'Commands / 命令示例' }: { code: string; title?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return <div className="command-panel">
    <div className="command-toolbar"><span><Terminal size={16} aria-hidden="true"/>{title}</span>
      <button type="button" onClick={copy}>
        {status === 'copied' ? <Check size={15} aria-hidden="true"/> : <Copy size={15} aria-hidden="true"/>}
        {status === 'copied' ? 'Copied / 已复制' : 'Copy / 复制'}
      </button>
    </div>
    <pre tabIndex={0}><code>{code}</code></pre>
    <span className={status === 'failed' ? 'copy-status' : 'sr-only'} role="status">
      {status === 'copied' ? 'Commands copied / 命令已复制' : status === 'failed' ? 'Select the commands to copy manually / 请选中命令手动复制' : ''}
    </span>
  </div>;
}
