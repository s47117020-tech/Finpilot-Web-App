import { WrappedSummary } from '@/services/api';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export function generateShareText(data: WrappedSummary): string {
  const lines = [
    `🎉 My ${data.year} Budget Wrapped — FinPilot`,
    '',
    `💰 Income: ${formatCurrency(data.total_income)}`,
    `💸 Expenses: ${formatCurrency(data.total_expenses)}`,
    `🏦 Saved: ${formatCurrency(data.total_savings)}`,
    `📊 Transactions: ${data.total_transactions}`,
    '',
  ];

  if (data.top_categories.length > 0) {
    lines.push('Top spending:');
    data.top_categories.slice(0, 3).forEach((c) => {
      lines.push(`  ${c.icon} ${c.category}: ${c.percentage}%`);
    });
    lines.push('');
  }

  if (data.goals_summary.completed > 0) {
    lines.push(`🎯 Goals completed: ${data.goals_summary.completed}/${data.goals_summary.total_goals}`);
  }

  lines.push('', 'Get your own Budget Wrapped → FinPilot');

  return lines.join('\n');
}

export async function shareWrapped(data: WrappedSummary): Promise<void> {
  const text = generateShareText(data);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `My ${data.year} Budget Wrapped`,
        text,
      });
      return;
    } catch {
      // User cancelled or share failed, fall through to clipboard
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // If clipboard also fails, create a temp textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
