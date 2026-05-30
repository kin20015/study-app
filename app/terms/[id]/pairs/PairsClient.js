"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HomeButton from "@/app/components/HomeButton";

// Перемешивание массива (алгоритм Фишера-Йетса)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PairsClient({ block }) {
  const [stage, setStage] = useState("start"); // start | playing | finished
  const [pairsPerRound, setPairsPerRound] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  // Игровое состояние
  const [rounds, setRounds] = useState([]); // массив раундов, каждый — массив терминов
  const [roundIndex, setRoundIndex] = useState(0);
  const [leftColumn, setLeftColumn] = useState([]); // термины
  const [rightColumn, setRightColumn] = useState([]); // определения
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState([]); // id уже соединённых
  const [wrongPair, setWrongPair] = useState(null); // подсветка ошибки
  const [mistakes, setMistakes] = useState(0);

  const totalTerms = block.terms.length;

  // Разбиваем все термины на раунды по pairsPerRound
  function buildRounds() {
    const shuffled = shuffle(block.terms);
    const result = [];
    for (let i = 0; i < shuffled.length; i += pairsPerRound) {
      result.push(shuffled.slice(i, i + pairsPerRound));
    }
    return result;
  }

  function startGame() {
    const newRounds = buildRounds();
    setRounds(newRounds);
    setRoundIndex(0);
    loadRound(newRounds[0]);
    setMistakes(0);
    setStage("playing");
  }

  function loadRound(roundTerms) {
    setLeftColumn(shuffle(roundTerms));
    setRightColumn(shuffle(roundTerms));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched([]);
    setWrongPair(null);
  }

  // Проверка пары при выборе обеих сторон
  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        // Правильно!
        setMatched((prev) => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Ошибка — подсветить красным и сбросить
        setWrongPair({ left: selectedLeft, right: selectedRight });
        setMistakes((m) => m + 1);
        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongPair(null);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight]);

  // Все пары в раунде собраны?
  const currentRoundTerms = rounds[roundIndex] || [];
  const roundComplete =
    currentRoundTerms.length > 0 &&
    matched.length === currentRoundTerms.length;

  function nextRound() {
    if (roundIndex + 1 >= rounds.length) {
      setStage("finished");
    } else {
      const newIndex = roundIndex + 1;
      setRoundIndex(newIndex);
      loadRound(rounds[newIndex]);
    }
  }

  // ---------- ЭКРАН СТАРТА ----------
  if (stage === "start") {
    const numRounds = Math.ceil(totalTerms / pairsPerRound);
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <HomeButton />
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/terms/${block.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← Назад к режимам
          </Link>

          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Пары</h1>
            <p className="text-zinc-600 mb-6">
              Соединяй термин слева с правильным определением справа.
              Все {totalTerms} терминов разбиты на раунды.
            </p>

            {/* Кнопка настроек */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm text-zinc-600 hover:text-zinc-900 mb-2 inline-flex items-center gap-1"
            >
              ⚙️ Пар за раунд: {pairsPerRound}
            </button>

            {showSettings && (
              <div className="bg-zinc-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-zinc-500 mb-3">
                  Чем больше пар — тем сложнее
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[4, 5, 6, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPairsPerRound(n)}
                      className={`rounded-lg py-2 font-semibold transition-colors ${
                        pairsPerRound === n
                          ? "bg-zinc-900 text-white"
                          : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-zinc-400 mb-6">
              Будет {numRounds} раунд(ов) по {pairsPerRound} пар
            </p>

            <button
              onClick={startGame}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
            >
              Начать
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- ЭКРАН ЗАВЕРШЕНИЯ ----------
  if (stage === "finished") {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <HomeButton />
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/terms/${block.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← Назад к режимам
          </Link>

          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">
              {mistakes === 0 ? "🏆" : mistakes <= 3 ? "🎉" : "👍"}
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Готово!</h1>
            <p className="text-zinc-600 mb-6">
              Ты соединил все {totalTerms} пар в блоке «{block.title}»
            </p>

            <div className="bg-zinc-50 rounded-xl p-4 mb-6">
              <div className="text-4xl font-bold text-zinc-900 mb-1">
                {mistakes}
              </div>
              <div className="text-sm text-zinc-600">
                {mistakes === 0 ? "ошибок — идеально!" : "ошибок"}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startGame}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
              >
                Пройти ещё раз
              </button>
              <Link
                href={`/terms/${block.id}`}
                className="bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-900 font-semibold rounded-2xl p-4 transition-colors"
              >
                Выбрать другой режим
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- ИГРОВОЙ ЭКРАН ----------
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <HomeButton />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/terms/${block.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            ← Назад
          </Link>
          <div className="text-sm text-zinc-600">
            Раунд {roundIndex + 1} / {rounds.length} · Ошибок: {mistakes}
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mb-6">
          Нажми термин слева, затем его определение справа
        </p>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* ЛЕВАЯ КОЛОНКА — ТЕРМИНЫ */}
          <div className="flex flex-col gap-3">
            {leftColumn.map((term) => {
              const isMatched = matched.includes(term.id);
              const isSelected = selectedLeft === term.id;
              const isWrong = wrongPair && wrongPair.left === term.id;
              return (
                <button
                  key={term.id}
                  disabled={isMatched}
                  onClick={() => !isMatched && setSelectedLeft(term.id)}
                  className={`rounded-xl p-3 text-sm font-medium text-left transition-all min-h-[60px] flex items-center ${
                    isMatched
                      ? "bg-green-50 border-2 border-green-200 text-green-700 opacity-50"
                      : isWrong
                      ? "bg-red-50 border-2 border-red-400 text-red-700"
                      : isSelected
                      ? "bg-zinc-900 border-2 border-zinc-900 text-white"
                      : "bg-white border-2 border-zinc-200 text-zinc-900 hover:border-zinc-400"
                  }`}
                >
                  {term.term}
                </button>
              );
            })}
          </div>

          {/* ПРАВАЯ КОЛОНКА — ОПРЕДЕЛЕНИЯ */}
          <div className="flex flex-col gap-3">
            {rightColumn.map((term) => {
              const isMatched = matched.includes(term.id);
              const isSelected = selectedRight === term.id;
              const isWrong = wrongPair && wrongPair.right === term.id;
              return (
                <button
                  key={term.id}
                  disabled={isMatched}
                  onClick={() => !isMatched && setSelectedRight(term.id)}
                  className={`rounded-xl p-3 text-xs leading-snug text-left transition-all min-h-[60px] flex items-center ${
                    isMatched
                      ? "bg-green-50 border-2 border-green-200 text-green-700 opacity-50"
                      : isWrong
                      ? "bg-red-50 border-2 border-red-400 text-red-700"
                      : isSelected
                      ? "bg-zinc-900 border-2 border-zinc-900 text-white"
                      : "bg-white border-2 border-zinc-200 text-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  {term.definition}
                </button>
              );
            })}
          </div>
        </div>

        {/* Кнопка следующего раунда */}
        {roundComplete && (
          <div className="mt-6">
            <button
              onClick={nextRound}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors"
            >
              {roundIndex + 1 >= rounds.length
                ? "Завершить ✓"
                : "Следующий раунд →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
