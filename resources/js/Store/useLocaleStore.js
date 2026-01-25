import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLocaleStore = create(
    persist(
        (set) => ({
            locale: 'en',
            direction: 'ltr',
            setLocale: (newLocale) => {
                const direction = newLocale === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.setAttribute('dir', direction);
                document.documentElement.setAttribute('lang', newLocale);
                set({ locale: newLocale, direction });
            },
        }),
        {
            name: 'locale-storage',
        }
    )
);

export default useLocaleStore;
