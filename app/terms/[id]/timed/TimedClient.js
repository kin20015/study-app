"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HomeButton from "@/app/components/HomeButton";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TOTAL_TIME = 60;

export default function TimedClient({ block }) {
  const [stage, setStage] = useState("start");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  function makeQuestion() {
    const terms = block.terms;
    const correct = terms[Math.floor(Math.random() * terms.length)];
    const askDefinition = Math.random() < 0.5;
    const others = shuffle(terms.filter((t) => t.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...others]);
    return {
      correctId: correct.id,
      promptLabel: askDefinition ? "Термин" : "Определение",
      prompt: askDefinition ? correct.term : correct.definition,
      options: options.map((t) => ({
        id: t.id,
        text: askDefinition ? t.definition : t.term,
      })),
    };
  }

  function startGame() {
    setScore(0);
    setAnswered(0);
    setTimeLeft(TOTAL_TIME);
    setFeedback(null);
    setQuestion(makeQuestion());
    setStage("playing");
  }

  useEffect(() => {
    if (stage !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setStage("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  function handleAnswer(chosenId) {
    if (feedback) return;
    if (chosenId === question.correctId) {
      setScore((s) => s + 1);
    }
    setAnswered((a) => a + 1);
    setFeedback({ chosenId, correctId: question.correctId });
    setTimeout(() => {
      setFeedback(null);
      setQuestion(makeQuestion());
    }, 500);
  }

  if (stage === "start") {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <HomeButton />
        <div className="max-w-2xl mx-auto">
          <Link href={`/terms/${block.id}`} className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block">
            ← Назад к режимам
          </Link>
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Тест на 60 секунд</h1>
            <p className="text-zinc-600 mb-6">
              За минуту ответь на максимум вопросов. Выбирай правильный вариант из четырёх. Вопросы по всем {block.terms.length} терминам.
            </p>
            <button onClick={startGame} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors">
              Старт
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "finished") {
    const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <HomeButton />
        <div className="max-w-2xl mx-auto">
          <Link href={`/terms/${block.id}`} className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block">
            ← Назад к режимам
          </Link>
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">
              {score >= 15 ? "🏆" : score >= 10 ? "🎉" : score >= 5 ? "👍" : "💪"}
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Время вышло!</h1>
            <p className="text-zinc-600 mb-6">Блок «{block.title}»</p>
            <div className="bg-zinc-50 rounded-xl p-4 mb-6">
              <div className="text-5xl font-bold text-zinc-900 mb-1">{score}</div>
              <div className="text-sm text-zinc-600">правильных из {answered} · точность {accuracy}%</div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={startGame} className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-2xl p-4 transition-colors">
                Сыграть ещё раз
              </button>
              <Link href={`/terms/${block.id}`} className="bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-900 font-semibold rounded-2xl p-4 transition-colors">
                Выбрать другой режим
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const timerColor = timeLeft <= 10 ? "bg-red-500" : timeLeft <= 25 ? "bg-amber-500" : "bg-zinc-900";

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <HomeButton />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-zinc-600">
            Счёт: <span className="font-bold text-zinc-900">{score}</span>
          </div>
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-zinc-900"}`}>
            {timeLeft}с
          </div>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2 mb-8 overflow-hidden">
          <div className={`h-full transition-all duration-1000 ease-linear ${timerColor}`} style={{ width: `${timerPercent}%` }} />
        </div>
        <div className="bg-white border-2 border-zinc-200 rounded-2xl p-6 mb-6 text-center min-h-[120px] flex flex-col justify-center">
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-2">{question.promptLabel}</div>
          <div className="text-lg font-semibold text-zinc-900">{question.prompt}</div>
        </div>
        <div className="flex flex-col gap-3">
          {question.options.map((opt) => {
            let style = "bg-white border-2 border-zinc-200 text-zinc-900 hover:border-zinc-400";
            if (feedback) {
              if (opt.id === feedback.correctId) {
                style = "bg-green-50 border-2 border-green-400 text-green-700";
              } else if (opt.id === feedback.chosenId) {
                style = "bg-red-50 border-2 border-red-400 text-red-700";
              } else {
                style = "bg-white border-2 border-zinc-200 text-zinc-400";
              }
            }
            return (
              <button key={opt.id} onClick={() => handleAnswer(opt.id)} disabled={!!feedback} className={`rounded-xl p-4 text-sm text-left transition-all ${style}`}>
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
