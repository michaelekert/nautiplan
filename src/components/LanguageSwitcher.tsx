import i18n from "@/i18n"

export function LanguageSwitcher() {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className="text-2xl"
        title="English"
      >
        🇺🇸
      </button>
      <button
        onClick={() => i18n.changeLanguage("pl")}
        className="text-2xl"
        title="Polski"
      >
        🇵🇱
      </button>
    </div>
  )
}
