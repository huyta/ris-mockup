import React from 'react';
import { Film, FileText, Calendar, Users, Activity } from 'lucide-react';

interface SummaryCardItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface StudySummaryCardsProps {
  cards: SummaryCardItem[];
}

export const StudySummaryCards: React.FC<StudySummaryCardsProps> = ({ cards }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0' }}>
                {card.value}
              </div>
              {card.subtitle && (
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {card.subtitle}
                </div>
              )}
            </div>

            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}
            >
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
