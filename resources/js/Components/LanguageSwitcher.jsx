import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import useLocaleStore from '@/Store/useLocaleStore';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { locale, setLocale } = useLocaleStore();

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    ];

    const handleChange = (newLocale) => {
        setLocale(newLocale);
        i18n.changeLanguage(newLocale);

        // Update backend locale
        router.post('/locale', { locale: newLocale }, {
            preserveState: true,
            preserveScroll: true,
            only: [],
        });
    };

    return (
        <select
            value={locale}
            onChange={(e) => handleChange(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                </option>
            ))}
        </select>
    );
}
