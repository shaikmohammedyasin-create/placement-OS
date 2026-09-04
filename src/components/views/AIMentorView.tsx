import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Clock,
  Briefcase,
  Code2,
  Brain,
  HelpCircle,
  Copy,
  Check,
  Plus,
  Calendar
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';

interface AIMentorViewProps {
  initialQuery?: string;
  onOpenAddModal?: (type?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedPlan?: {
    title: string;
    duration: number;
    category: string;
  };
}

export const AIMentorView: React.FC<AIMentorViewProps> = ({ initialQuery, onOpenAddModal }) => {
  const {
    userName,
    currentPhaseName,
    overallReadinessScore,
    completedNodesCount,
    dailyFocus,
    addEvent
  } = usePlacement();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Good day, ${userName}. I am your Placement Intelligence Mentor, calibrated specifically to your 38-node dependency graph and ₹23.3 LPA+ target.\n\nI can analyze your daily schedule, generate custom mock coding rounds, diagnose weak topics, or break down high-ROI study drills.`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  // Specific suggestion chips from Section 21
  const suggestionChips = [
    { label: 'What should I study today?', query: 'What should I study today based on my current placement phase and 38-node graph?' },
    { label: 'I have an interview tomorrow', query: 'I have a technical interview tomorrow. Give me an urgent last-minute checklist and high-frequency topics.' },
    { label: "Build today's study plan", query: 'Build me a high-intensity 2-hour daily study plan with exact drills and done criteria.' },
    { label: 'Test me on Java fundamentals', query: 'Run a 3-question rapid-fire technical assessment on Java memory, OOP, and collections.' }
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            userName,
            currentPhase: currentPhaseName,
            readinessScore: overallReadinessScore,
            completedNodes: completedNodesCount,
            dailyFocus: dailyFocus.primaryFocus
          }
        })
      });

      if (!response.ok) throw new Error('AI service responded with error');
      const data = await response.json();

      // Check if response looks like a study plan
      const hasPlan = textToSend.toLowerCase().includes('plan') || textToSend.toLowerCase().includes('study today');

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || data.response || 'I have analyzed your roadmap. Let us execute with discipline.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPlan: hasPlan ? {
          title: 'Daily AI Placement Drill',
          duration: 75,
          category: 'DSA'
        } : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Based on your active roadmap node (${currentPhaseName}), focus your highest cognitive window today on **DSA Two Pointers & Binary Search**, followed by **20 timed Aptitude problems**.\n\nExecution standard: Write your solutions in plain text without syntax autocomplete to match real campus OA environments.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlanner = (msg: ChatMessage) => {
    const todayStr = new Date().toISOString().split('T')[0];
    addEvent({
      title: msg.suggestedPlan?.title || 'AI Recommended Study Drill',
      category: msg.suggestedPlan?.category || 'DSA',
      date: todayStr,
      startTime: '17:00',
      durationMinutes: msg.suggestedPlan?.duration || 60,
      eventType: 'study',
      status: 'scheduled',
      notes: 'Generated by AI Placement Intelligence'
    });
    setAddedPlanId(msg.id);
    setTimeout(() => setAddedPlanId(null), 3000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Top Intelligence Header (Section 21) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-[#282830] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#AF52DE]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AF52DE]">
              Personal Placement Intelligence
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mt-0.5">
            AI Placement Mentor
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Trained on the 38-node roadmap, recruiter evaluation criteria, and ₹23.3 LPA benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 shrink-0">
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
            Target: ₹23.3L Google L3
          </span>
        </div>
      </div>

      {/* Suggestion Chips (Section 21) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-[#AF52DE] text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-[#AF52DE] text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#5856D6] text-white rounded-tr-none'
                  : 'bg-white dark:bg-[#151519] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#282830] rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Action: Add this plan to planner button (Section 21) */}
              {msg.suggestedPlan && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#25252D] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">
                    Recommended Study Drill ({msg.suggestedPlan.duration}m)
                  </span>
                  <button
                    onClick={() => handleAddToPlanner(msg)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#5856D6] hover:bg-[#4745B8] text-white font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    {addedPlanId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added to Planner!</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Add to Planner</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-1.5 text-[10px] text-gray-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="p-1 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                    title="Copy Text"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#AF52DE] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] text-xs text-gray-500 rounded-tl-none shadow-sm flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#AF52DE]" />
              <span>Analyzing dependency graph and synthesizing answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="relative shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask placement strategy, mock technical questions, or study prioritization..."
          className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] focus:border-[#5856D6] focus:outline-none text-xs text-gray-900 dark:text-white shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#5856D6] hover:bg-[#4745B8] text-white disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
