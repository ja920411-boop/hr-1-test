/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trophy, 
  UserPlus, 
  Trash2, 
  Shuffle, 
  LayoutGrid, 
  Settings2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Group {
  id: number;
  members: string[];
}

export default function App() {
  const [namesInput, setNamesInput] = useState<string>('');
  const [names, setNames] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'draw' | 'group'>('input');
  const [drawIndex, setDrawIndex] = useState(0);

  // Sync names from input
  useEffect(() => {
    const list = namesInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    setNames(list);
  }, [namesInput]);

  const handleLuckyDraw = () => {
    if (names.length === 0) return;
    
    setIsDrawing(true);
    setWinner(null);
    
    let counter = 0;
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    
    const timer = setInterval(() => {
      setDrawIndex(Math.floor(Math.random() * names.length));
      counter++;
      
      if (counter >= steps) {
        clearInterval(timer);
        const finalWinner = names[Math.floor(Math.random() * names.length)];
        setWinner(finalWinner);
        setIsDrawing(false);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
      }
    }, interval);
  };

  const handleGrouping = () => {
    if (names.length === 0) return;
    
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: Math.floor(i / groupSize) + 1,
        members: shuffled.slice(i, i + groupSize)
      });
    }
    
    setGroups(newGroups);
    setActiveTab('group');
  };

  const clearAll = () => {
    if (window.confirm('確定要清除所有名單嗎？')) {
      setNamesInput('');
      setWinner(null);
      setGroups([]);
      setActiveTab('input');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">HR 抽獎分組小助手</h1>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('input')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'input' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              名單匯入
            </button>
            <button 
              onClick={() => setActiveTab('draw')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'draw' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              幸運抽獎
            </button>
            <button 
              onClick={() => setActiveTab('group')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'group' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              自動分組
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Input Section */}
          {activeTab === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      輸入成員名單
                    </label>
                    <button 
                      onClick={clearAll}
                      className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      清除全部
                    </button>
                  </div>
                  <textarea
                    value={namesInput}
                    onChange={(e) => setNamesInput(e.target.value)}
                    placeholder="請輸入名字，每行一個或用逗號隔開..."
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-600 leading-relaxed"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      已偵測到 <span className="font-bold text-indigo-600">{names.length}</span> 位成員
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveTab('draw')}
                        disabled={names.length === 0}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        去抽獎
                      </button>
                      <button 
                        onClick={() => setActiveTab('group')}
                        disabled={names.length === 0}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        去分組
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    分組設定
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-2">每組人數</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          min="1"
                          max={names.length || 100}
                          value={groupSize}
                          onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                          className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="text-sm text-slate-400 whitespace-nowrap">人 / 組</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        預計將分成 <span className="font-bold text-indigo-600">{Math.ceil(names.length / groupSize) || 0}</span> 組
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    快速提示
                  </h3>
                  <ul className="text-xs text-indigo-700 space-y-2 list-disc list-inside">
                    <li>直接貼上 Excel 姓名欄位即可</li>
                    <li>抽獎過程有視覺化動畫效果</li>
                    <li>分組結果會隨機打亂順序</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lucky Draw Section */}
          {activeTab === 'draw' && (
            <motion.div 
              key="draw"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-full max-w-2xl bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                
                <h2 className="text-3xl font-bold text-slate-900 mb-8">誰是幸運兒？</h2>
                
                <div className="h-48 flex items-center justify-center mb-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <AnimatePresence mode="wait">
                    {isDrawing ? (
                      <motion.div
                        key="drawing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-5xl font-black text-indigo-600 tracking-tighter"
                      >
                        {names[drawIndex]}
                      </motion.div>
                    ) : winner ? (
                      <motion.div
                        key="winner"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="bg-amber-100 p-4 rounded-full">
                          <Trophy className="w-12 h-12 text-amber-500" />
                        </div>
                        <div className="text-6xl font-black text-slate-900 tracking-tight">
                          {winner}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center gap-2">
                        <Shuffle className="w-12 h-12 opacity-20" />
                        <p className="text-sm font-medium">準備好就點擊下方按鈕</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleLuckyDraw}
                  disabled={isDrawing || names.length === 0}
                  className="group relative px-12 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isDrawing ? '正在抽取...' : winner ? '再抽一次' : '開始抽獎'}
                    <Shuffle className={`w-6 h-6 ${isDrawing ? 'animate-spin' : ''}`} />
                  </span>
                </button>

                {names.length === 0 && (
                  <p className="mt-6 text-red-500 text-sm flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    請先在名單匯入頁面輸入成員
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Grouping Section */}
          {activeTab === 'group' && (
            <motion.div 
              key="group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">分組結果</h2>
                  <p className="text-sm text-slate-500">共 {names.length} 人，分成 {groups.length} 組</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleGrouping}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Shuffle className="w-4 h-4" />
                    重新隨機分組
                  </button>
                </div>
              </div>

              {groups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.map((group, idx) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Group {group.id}</span>
                        <span className="text-xs text-slate-400">{group.members.length} 人</span>
                      </div>
                      <ul className="space-y-3">
                        {group.members.map((member, mIdx) => (
                          <li key={mIdx} className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            {member}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white py-24 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 gap-4">
                  <LayoutGrid className="w-16 h-16 opacity-10" />
                  <div className="text-center">
                    <p className="font-semibold text-slate-600">尚未進行分組</p>
                    <p className="text-sm">點擊下方按鈕開始自動分組</p>
                  </div>
                  <button
                    onClick={handleGrouping}
                    disabled={names.length === 0}
                    className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    立即分組
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <p>© 2024 HR 抽獎分組小助手 - 提升行政效率的專業工具</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">隱私政策</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">使用指南</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">聯絡支援</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
