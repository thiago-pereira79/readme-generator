import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0b0f19] text-slate-400 py-6 px-4 mt-auto border-t border-slate-800/40 select-none font-sans flex items-center justify-center">
      <div className="max-w-[1440px] w-full text-center">
        <p className="text-[11px] sm:text-xs text-slate-500 leading-normal font-medium tracking-wide">
          {t('footer.rights', { year: currentYear })}
        </p>
      </div>
    </footer>
  );
};
