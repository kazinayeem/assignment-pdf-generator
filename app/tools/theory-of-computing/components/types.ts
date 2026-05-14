export interface State {
  id: string;
  label: string;
  x: number;
  y: number;
  isStart: boolean;
  isAccept: boolean;
}

export interface Transition {
  from: string;
  to: string;
  symbol: string;
}

export interface Automaton {
  states: State[];
  transitions: Transition[];
  alphabet: string[];
}

export interface SimulationStep {
  fromState: string;
  toState: string;
  symbol: string;
  activeStates: string[];
  step: number;
}

export function createBlankAutomaton(): Automaton {
  return { states: [], transitions: [], alphabet: [] };
}

export function addState(automaton: Automaton, label?: string): Automaton {
  const id = `q${automaton.states.length}`;
  const angle = (automaton.states.length / 6) * Math.PI * 2;
  const cx = 300 + Math.cos(angle) * 150;
  const cy = 225 + Math.sin(angle) * 150;
  return {
    ...automaton,
    states: [...automaton.states, { id, label: label || id, x: cx, y: cy, isStart: false, isAccept: false }],
  };
}

export function toggleStart(automaton: Automaton, id: string): Automaton {
  return {
    ...automaton,
    states: automaton.states.map((s) => ({ ...s, isStart: s.id === id ? true : s.isStart })),
  };
}

export function toggleAccept(automaton: Automaton, id: string): Automaton {
  return {
    ...automaton,
    states: automaton.states.map((s) => (s.id === id ? { ...s, isAccept: !s.isAccept } : s)),
  };
}

export function removeState(automaton: Automaton, id: string): Automaton {
  return {
    ...automaton,
    states: automaton.states.filter((s) => s.id !== id),
    transitions: automaton.transitions.filter((t) => t.from !== id && t.to !== id),
  };
}

export function addTransition(automaton: Automaton, from: string, to: string, symbol: string): Automaton {
  const t: Transition = { from, to, symbol };
  return {
    ...automaton,
    transitions: [...automaton.transitions, t],
    alphabet: automaton.alphabet.includes(symbol) ? automaton.alphabet : [...automaton.alphabet, symbol],
  };
}

export function removeTransition(automaton: Automaton, index: number): Automaton {
  const t = automaton.transitions[index];
  const newTransitions = automaton.transitions.filter((_, i) => i !== index);
  const stillUsed = newTransitions.some((tt) => tt.symbol === t.symbol);
  return {
    ...automaton,
    transitions: newTransitions,
    alphabet: stillUsed ? automaton.alphabet : automaton.alphabet.filter((s) => s !== t.symbol),
  };
}

export function updateStatePos(automaton: Automaton, id: string, x: number, y: number): Automaton {
  return {
    ...automaton,
    states: automaton.states.map((s) => (s.id === id ? { ...s, x, y } : s)),
  };
}

export function renameState(automaton: Automaton, id: string, label: string): Automaton {
  return {
    ...automaton,
    states: automaton.states.map((s) => (s.id === id ? { ...s, label } : s)),
  };
}

export function simulateDFA(automaton: Automaton, input: string): {
  accepted: boolean;
  steps: SimulationStep[];
  path: string[];
} {
  const steps: SimulationStep[] = [];
  const path: string[] = [];
  const startState = automaton.states.find((s) => s.isStart);
  if (!startState) return { accepted: false, steps: [], path: [] };

  let current = startState.id;
  path.push(current);

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const trans = automaton.transitions.find((t) => t.from === current && t.symbol === symbol);
    if (!trans) {
      steps.push({ fromState: current, toState: "", symbol, activeStates: [current], step: i + 1 });
      return { accepted: false, steps, path };
    }
    steps.push({ fromState: current, toState: trans.to, symbol, activeStates: [current], step: i + 1 });
    current = trans.to;
    path.push(current);
  }

  const finalState = automaton.states.find((s) => s.id === current);
  const accepted = finalState?.isAccept || false;
  return { accepted, steps, path };
}

export function epsilonClosure(automaton: Automaton, stateIds: string[]): string[] {
  const closure = new Set(stateIds);
  const queue = [...stateIds];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const t of automaton.transitions) {
      if (t.from === current && t.symbol === "ε" && !closure.has(t.to)) {
        closure.add(t.to);
        queue.push(t.to);
      }
    }
  }
  return Array.from(closure);
}

export function simulateNFA(automaton: Automaton, input: string): {
  accepted: boolean;
  steps: { activeStates: string[]; symbol: string; step: number }[];
} {
  const steps: { activeStates: string[]; symbol: string; step: number }[] = [];
  const startStates = epsilonClosure(automaton, automaton.states.filter((s) => s.isStart).map((s) => s.id));
  let active = [...startStates];

  steps.push({ activeStates: [...active], symbol: "ε-closure", step: 0 });

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const next: string[] = [];
    for (const stateId of active) {
      for (const t of automaton.transitions) {
        if (t.from === stateId && t.symbol === symbol) {
          next.push(t.to);
        }
      }
    }
    active = epsilonClosure(automaton, [...new Set(next)]);
    steps.push({ activeStates: [...active], symbol, step: i + 1 });
  }

  const accepted = active.some((id) => automaton.states.find((s) => s.id === id)?.isAccept);
  return { accepted, steps };
}

export function nfaToDfa(nfa: Automaton): {
  dfa: Automaton;
  conversionSteps: { subset: string[]; stateName: string; transitions: { symbol: string; to: string }[] }[];
} {
  const alphabet = nfa.alphabet.filter((s) => s !== "ε");
  const startStates = epsilonClosure(nfa, nfa.states.filter((s) => s.isStart).map((s) => s.id));
  const dfaStates: { name: string; ids: string[]; isAccept: boolean }[] = [];
  const dfaTransitions: Transition[] = [];
  const conversionSteps: { subset: string[]; stateName: string; transitions: { symbol: string; to: string }[] }[] = [];
  const queue: string[][] = [startStates];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const subset = queue.shift()!;
    const key = [...subset].sort().join(",");
    if (visited.has(key)) continue;
    visited.add(key);
    const name = `{${subset.join(",")}}`;
    const isAccept = subset.some((id) => nfa.states.find((s) => s.id === id)?.isAccept);
    dfaStates.push({ name, ids: subset, isAccept });
    const trans: { symbol: string; to: string }[] = [];

    for (const symbol of alphabet) {
      const move: string[] = [];
      for (const stateId of subset) {
        for (const t of nfa.transitions) {
          if (t.from === stateId && t.symbol === symbol) {
            move.push(t.to);
          }
        }
      }
      if (move.length === 0) continue;
      const closure = epsilonClosure(nfa, [...new Set(move)]);
      const closureKey = [...closure].sort().join(",");
      trans.push({ symbol, to: `{${closureKey}}` });
      dfaTransitions.push({ from: name, to: `{${closureKey}}`, symbol });
      if (!visited.has(closureKey)) {
        queue.push(closure);
      }
    }
    conversionSteps.push({ subset, stateName: name, transitions: trans });
  }

  const dfa: Automaton = {
    states: dfaStates.map((ds, i) => ({
      id: ds.name,
      label: ds.name,
      x: 300 + Math.cos((i / dfaStates.length) * Math.PI * 2) * 180,
      y: 225 + Math.sin((i / dfaStates.length) * Math.PI * 2) * 180,
      isStart: ds.name === `{${startStates.sort().join(",")}}`,
      isAccept: ds.isAccept,
    })),
    transitions: dfaTransitions,
    alphabet: [...alphabet],
  };

  return { dfa, conversionSteps };
}

export const DFA_EXAMPLES = {
  "Even Binary": {
    states: [
      { id: "q0", label: "q0", x: 300, y: 150, isStart: true, isAccept: true },
      { id: "q1", label: "q1", x: 480, y: 300, isStart: false, isAccept: false },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "1" },
      { from: "q0", to: "q0", symbol: "0" },
      { from: "q1", to: "q0", symbol: "1" },
      { from: "q1", to: "q1", symbol: "0" },
    ],
    alphabet: ["0", "1"],
  },
  "Starts with 'a'": {
    states: [
      { id: "q0", label: "q0", x: 200, y: 225, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 400, y: 150, isStart: false, isAccept: true },
      { id: "q2", label: "q2", x: 400, y: 300, isStart: false, isAccept: false },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "a" },
      { from: "q0", to: "q2", symbol: "b" },
      { from: "q1", to: "q1", symbol: "a" },
      { from: "q1", to: "q1", symbol: "b" },
      { from: "q2", to: "q2", symbol: "a" },
      { from: "q2", to: "q2", symbol: "b" },
    ],
    alphabet: ["a", "b"],
  },
} as Record<string, Automaton>;
