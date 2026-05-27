"use client";

import { useState } from "react";
import Link from "next/link";

// Вспомогательная функция: перемешивает массив (алгоритм Фишера-Йетса)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CardsClient({ block }) {
  // Состояния стартового экрана
  const [stage, setStage] = useState("start"); // "start" | "training" | "finished"
  const [shuffle, setShuffle] = useState(false);
  const [direction, setDirection] = useState("termFirst"); // "termFirst" | "definitionFirst"

  // Состояния тренировки
  const [terms, setTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState([]);
  const [unknownIds, setUnknownIds] = useState([]);

  // Запуск тренировки с текущими настройками
  function handleStart(termsToUse) {
    const prepared = shuffle ? shuffleArray(termsToUse) : termsToUse;
    setTerms(prepared);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownIds([]);
    setUnknownIds([]);
    setStage("training");
  }

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  function handleAnswer(isKnown) {
    const currentTerm = terms[currentIndex];
    if (isKnown) {
      setKnownIds([...knownIds, currentTerm.id]);
    } else {
      setUnknownIds([...unknownIds, currentTerm.id]);
    }

    if (currentIndex + 1 >= terms.length) {
      setStage("finished");
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }

  // Повторить только те, которые отметил как "не знаю"
  function handleRepeatHard() {
    const hardTerms = block.terms.filter((t) => unknownIds.includes(t.id));
    handleStart(hardTerms);
  }

  // Начать полностью заново — со всеми терминами
  function handleRestartAll() {
    handleStart(block.terms);
  }

  // Вернуться на стартовый экран
  function handleBackToStart() {
    setStage("start");
  }

  // ============ СТАРТОВЫЙ ЭКРАН ============
  if (stage === "start") {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/terms/${block.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← Назад к режимам
          </Link>

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            🎴 Карточки
          </h1>
          <p className="text-zinc-600 mb-8">
            {block.title} · {block.terms.length} терминов
          </p>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Настройки тренировки
            </h2>

            {/* Переключатель направления */}
            <div className="mb-6">
              <div className="text-sm font-medium text-zinc-700 mb-2">
                Что показывать первым?
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDirection("termFirst")}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    direction === "termFirst"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  Термин → Определение
                </button>
                <button
                  onClick={() => setDirection("definitionFirst")}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    direction === "definitionFirst"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  Определение → Термин
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {direction === "termFirst"
                  ? "Сначала видишь слово, потом проверяешь определение"
                  : "Сначала видишь определение, потом вспоминаешь термин (сложнее)"}
              </p>
            </div>

            {/* Переключатель перемешивания */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-zinc-700">
                    🔀 Перемешать карточки
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Случайный порядок вместо алфавитного
                  </p>
                </div>
                <div
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    shuffle ? "bg-zinc-900" : "bg-zinc-300"
                  }`}
                  onClick={() => setShuffle(!shuffle)}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      shuffle ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={() => handleStart(block.terms)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
          >
            Начать тренировку →
          </button>
        </div>
      </div>
    );
  }

  // ============ ЭКРАН ЗАВЕРШЕНИЯ ============
  if (stage === "finished") {
    const total = terms.length;
    const percent = Math.round((knownIds.length / total) * 100);
    const hasHardTerms = unknownIds.length > 0;

    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/terms/${block.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← К режимам
          </Link>

          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">
              {percent >= 80 ? "🎉" : percent >= 50 ? "👍" : "💪"}
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Готово!</h1>
            <p className="text-zinc-600 mb-6">
              Прошёл {total}{" "}
              {total === 1 ? "термин" : total < 5 ? "термина" : "терминов"}
            </p>

            <div className="bg-zinc-50 rounded-xl p-4 mb-6">
              <div className="text-4xl font-bold text-zinc-900 mb-1">
                {percent}%
              </div>
              <div className="text-sm text-zinc-600 flex items-center justify-center gap-3">
                <span className="text-green-700">✓ {knownIds.length}</span>
                <span className="text-zinc-300">·</span>
                <span className="text-red-700">✗ {unknownIds.length}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {hasHardTerms && (
                <button
                  onClick={handleRepeatHard}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl p-4 transition-colors"
                >
                  🔁 Повторить только сложные ({unknownIds.length})
                </button>
              )}
              <button
                onClick={handleRestartAll}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
              >
                Пройти все ещё раз
              </button>
              <button
                onClick={handleBackToStart}
                className="bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-900 font-semibold rounded-2xl p-4 transition-colors"
              >
                Изменить настройки
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ОСНОВНОЙ ЭКРАН ТРЕНИРОВКИ ============
  const currentTerm = terms[currentIndex];
  const total = terms.length;
  const progress = Math.round((currentIndex / total) * 100);

  // Определяем, что показывать на лицевой и обратной сторонах
  const frontLabel = direction === "termFirst" ? "ТЕРМИН" : "ОПРЕДЕЛЕНИЕ";
  const backLabel = direction === "termFirst" ? "ОПРЕДЕЛЕНИЕ" : "ТЕРМИН";
  const frontContent =
    direction === "termFirst" ? currentTerm.term : currentTerm.definition;
  const backContent =
    direction === "termFirst" ? currentTerm.definition : currentTerm.term;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToStart}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            ← Прервать
          </button>
          <div className="text-sm text-zinc-600">
            {currentIndex + 1} / {total}
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="w-full bg-zinc-200 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-zinc-900 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Карточка */}
        <button
          onClick={handleFlip}
          className="w-full bg-white border-2 border-zinc-200 hover:border-zinc-300 rounded-3xl p-8 md:p-12 min-h-[300px] flex flex-col items-center justify-center text-center transition-all cursor-pointer mb-6"
        >
          {!isFlipped ? (
            <>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">
                {frontLabel}
              </div>
              <div
                className={
                  direction === "termFirst"
                    ? "text-2xl md:text-3xl font-bold text-zinc-900"
                    : "text-lg text-zinc-800 leading-relaxed"
                }
              >
                {frontContent}
              </div>
              <div className="text-sm text-zinc-400 mt-6">
                Нажми, чтобы увидеть{" "}
                {direction === "termFirst" ? "определение" : "термин"}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">
                {backLabel}
              </div>
              <div
                className={
                  direction === "termFirst"
                    ? "text-lg text-zinc-800 leading-relaxed"
                    : "text-2xl md:text-3xl font-bold text-zinc-900"
                }
              >
                {backContent}
              </div>
              {currentTerm.shortMeaning && (
                <div className="mt-4 text-sm italic text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
                  {currentTerm.shortMeaning}
                </div>
              )}
            </>
          )}
        </button>

        {/* Кнопки оценки */}
        {isFlipped ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-700 font-semibold rounded-2xl p-4 transition-colors"
            >
              ✗ Не знаю
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700 font-semibold rounded-2xl p-4 transition-colors"
            >
              ✓ Знаю
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-zinc-400">
            Сначала вспомни сам, потом переверни карточку
          </p>
        )}
      </div>
    </div>
  );
}
