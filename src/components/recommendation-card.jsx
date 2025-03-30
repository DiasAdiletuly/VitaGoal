"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  title,
  description,
  supplements = [],
  onSave = () => {},
  onOrder = () => {},
}) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {title || "Ваши персональные рекомендации"}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {description ||
          "На основе ваших ответов мы подобрали для вас следующие витамины и БАДы, которые могут поддержать ваш организм и улучшить самочувствие."}
      </p>

      <div className="space-y-6">
        {supplements.map((supplement, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {supplement.name}
            </h3>

            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Польза:
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  {supplement.benefits}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Рекомендуемая дозировка:
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  {supplement.dosage}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Дополнительные советы:
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  {supplement.tips}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() =>
                  setExpandedItem(expandedItem === index ? null : index)
                }
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                {expandedItem === index ? "Скрыть" : "Подробнее"}
              </button>

              <button
                onClick={() => onOrder(supplement)}
                className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Заказать
              </button>
            </div>

            {expandedItem === index && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Научная информация:
                </h4>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                  {supplement.scientificLinks?.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Исследование {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg ${
            isSaving ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
          } text-white transition-colors`}
        >
          {isSaving ? "Сохранение..." : "Сохранить рекомендации"}
        </button>
      </div>
    </div>
  );
}

function StoryComponent() {
  const sampleData = {
    title: "Персонализированный план добавок",
    description:
      "Основываясь на вашем профиле здоровья, мы подобрали следующие добавки",
    supplements: [
      {
        name: "Омега-3 VitaGoal Premium",
        benefits: "Поддержка сердечно-сосудистой системы и когнитивных функций",
        dosage: "2 капсулы в день во время еды",
        tips: "Лучше принимать с жирной пищей для лучшего усвоения",
        scientificLinks: [
          "https://example.com/study1",
          "https://example.com/study2",
        ],
      },
      {
        name: "Витамин D3 VitaGoal",
        benefits: "Укрепление костей и иммунной системы",
        dosage: "1 капсула в день с едой",
        tips: "Рекомендуется принимать утром для лучшего усвоения",
        scientificLinks: [
          "https://example.com/study3",
          "https://example.com/study4",
        ],
      },
    ],
  };

  return (
    <MainComponent
      {...sampleData}
      onSave={() => new Promise((resolve) => setTimeout(resolve, 2000))}
      onOrder={(supplement) => console.log("Ordering:", supplement.name)}
    />
  );
});
}