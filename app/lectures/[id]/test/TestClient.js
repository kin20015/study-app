"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestClient({ lecture, test }) {
  const [stage, setStage] = useState("start"); // "start" | "question" | "finished"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState([]); // [{questionId, isCorrect}]

  const total = test.questions.length;
  const currentQuestion = test.questions[currentIndex];

  function handleStart() {
    setStage("question");
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsAnswered(false);
    setResults([]);
  }

  function handleSelect(optionIndex) {
    if (isAnswered) return; // блокируем после ответа
    setSelectedIndex(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setResults([
      ...results,
      { questionId: currentQuestion.id, isCorrect },
    ]);
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setStage("finished");
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    }
  }

  // ============ СТАРТОВЫЙ ЭКРАН ============
  if (stage === "start") {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/lectures/${lecture.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← К лекции
          </Link>

          <div className="bg-white border border-zinc-200 rounded-2xl p-8">
            <div className="text-5xl mb-4 text-center">📝</div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2 text-center">
              {test.title}
            </h1>
            <p className="text-zinc-600 mb-6 text-center">
              {test.description}
            </p>

            <div className="bg-zinc-50 rounded-xl p-4 mb-6 text-sm text-zinc-700">
              <div className="mb-2">
                <span className="font-semibold">Вопросов:</span> {total}
              </div>
              <div>
                <span className="font-semibold">Формат:</span> выбор одного
                правильного ответа из четырёх
              </div>
            </div>

            <p className="text-sm text-zinc-500 text-center mb-6">
              После ответа сразу видно, правильно ли ты ответил.
              <br />В конце теста — общий результат.
            </p>

            <button
              onClick={handleStart}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
            >
              Начать тест →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ ЭКРАН ЗАВЕРШЕНИЯ ============
  if (stage === "finished") {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const percent = Math.round((correctCount / total) * 100);
    const grade =
      percent >= 90
        ? { emoji: "🏆", text: "Отлично!" }
        : percent >= 70
        ? { emoji: "🎉", text: "Хороший результат" }
        : percent >= 50
        ? { emoji: "👍", text: "Неплохо, но есть куда расти" }
        : { emoji: "💪", text: "Стоит повторить материал" };

    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/lectures/${lecture.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← К лекции
          </Link>

          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{grade.emoji}</div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1">
              {grade.text}
            </h1>
            <p className="text-zinc-600 mb-6">{test.title}</p>

            <div className="bg-zinc-50 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-zinc-900 mb-2">
                {percent}%
              </div>
              <div className="text-sm text-zinc-600">
                Правильных ответов: {correctCount} из {total}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStart}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
              >
                Пройти ещё раз
              </button>
              <Link
                href={`/lectures/${lecture.id}`}
                className="bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-900 font-semibold rounded-2xl p-4 transition-colors"
              >
                Вернуться к лекции
              </Link>
              <Link
                href="/lectures"
                className="text-sm text-zinc-500 hover:text-zinc-900 mt-2"
              >
                К списку всех лекций
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ЭКРАН ВОПРОСА ============
  const progress = Math.round(((currentIndex + (isAnswered ? 1 : 0)) / total) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/lectures/${lecture.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            ← Прервать
          </Link>
          <div className="text-sm text-zinc-600">
            Вопрос {currentIndex + 1} / {total}
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="w-full bg-zinc-200 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-zinc-900 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Карточка вопроса */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 mb-6">
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">
            Вопрос {currentIndex + 1}
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Варианты ответов */}
        <div className="flex flex-col gap-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctIndex;
            const isSelected = selectedIndex === index;

            let style =
              "bg-white border-2 border-zinc-200 hover:border-zinc-400 text-zinc-900";

            if (isAnswered) {
              if (isCorrect) {
                style = "bg-green-50 border-2 border-green-500 text-green-900";
              } else if (isSelected) {
                style = "bg-red-50 border-2 border-red-500 text-red-900";
              } else {
                style = "bg-zinc-50 border-2 border-zinc-200 text-zinc-500";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={`${style} rounded-2xl p-4 text-left transition-all flex items-start gap-3 ${
                  !isAnswered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 pt-0.5">{option}</span>
                {isAnswered && isCorrect && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="text-red-600 text-xl">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Кнопка "Дальше" появляется только после ответа */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
          >
            {currentIndex + 1 >= total ? "Показать результат" : "Дальше →"}
          </button>
        )}
      </div>
    </div>
  );
}
