"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, BrainCircuit, GitBranch, Target, RotateCcw } from "lucide-react";

type Point = { x: number; y: number; label: "blue" | "red" };

const INITIAL_POINTS: Point[] = [
  { x: 100, y: 100, label: "red" }, { x: 120, y: 80, label: "red" },
  { x: 80, y: 120, label: "red" }, { x: 300, y: 200, label: "blue" },
  { x: 280, y: 180, label: "blue" }, { x: 320, y: 220, label: "blue" },
];

function knnPredict(newPoint: Point, points: Point[], k: number): "red" | "blue" {
  const distances = points.map((p) => ({
    label: p.label,
    dist: Math.sqrt((p.x - newPoint.x) ** 2 + (p.y - newPoint.y) ** 2),
  }));
  distances.sort((a, b) => a.dist - b.dist);
  const nearest = distances.slice(0, k);
  const redCount = nearest.filter((n) => n.label === "red").length;
  const blueCount = nearest.length - redCount;
  return redCount > blueCount ? "red" : "blue";
}

export default function MLPage() {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [k, setK] = useState(3);
  const [prediction, setPrediction] = useState<{ x: number; y: number; predicted: "red" | "blue" } | null>(null);
  const [message, setMessage] = useState("Click on the chart to classify a point using KNN!");
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoint: Point = { x, y, label: "blue" }; // placeholder label
    const predicted = knnPredict(newPoint, points, k);
    setPrediction({ x, y, predicted });
    setMessage(`Predicted label at (${Math.round(x)}, ${Math.round(y)}): ${predicted.toUpperCase()} (k=${k})`);
  }, [points, k]);

  const addLabeledPoint = (label: "red" | "blue") => {
    const x = Math.floor(Math.random() * 350) + 25;
    const y = Math.floor(Math.random() * 350) + 25;
    setPoints((p) => [...p, { x, y, label }]);
    setMessage(`Added ${label} training point at (${x}, ${y})`);
  };

  const reset = () => {
    setPoints(INITIAL_POINTS);
    setPrediction(null);
    setMessage("Reset to initial training data.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Machine Learning</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Machine Learning</h1>
              <p className="text-gray-500 text-sm">Supervised, unsupervised, and interactive KNN demo.</p>
            </div>
          </div>
        </div>

        {/* Supervised vs Unsupervised */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" /> Supervised Learning
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Models learn from labeled data (input → output pairs). Goal: predict labels for new data.
            </p>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-gray-700">Regression:</p>
              <p className="text-gray-500">Predict continuous values (price, temperature)</p>
              <p className="font-bold text-gray-700 mt-2">Classification:</p>
              <p className="text-gray-500">Predict discrete classes (spam/not spam, cat/dog)</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-500" /> Unsupervised Learning
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Models find patterns in unlabeled data. No ground-truth outputs provided.
            </p>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-gray-700">Clustering:</p>
              <p className="text-gray-500">Group similar data points (K-Means, DBSCAN)</p>
              <p className="font-bold text-gray-700 mt-2">Dimensionality Reduction:</p>
              <p className="text-gray-500">Compress data while preserving structure (PCA, t-SNE)</p>
            </div>
          </div>
        </div>

        {/* Train/Test Split & Cross-Validation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Train/Test Split & Cross-Validation</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Always split data into training and test sets to evaluate generalization. Cross-validation (k-fold) provides more robust performance estimates by rotating the validation fold.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris

data = load_iris()
X, y = data.data, data.target

# Train/test split (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
acc = model.score(X_test, y_test)
print(f"Test accuracy: {acc:.3f}")

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5)
print(f"CV scores: {scores}")
print(f"Mean: {scores.mean():.3f} (+/- {scores.std():.3f})")`}</pre>
          </div>
        </div>

        {/* Interactive KNN Demo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interactive KNN Classifier</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">k =</span>
              <input type="range" min={1} max={11} step={2} value={k}
                onChange={(e) => setK(parseInt(e.target.value))}
                className="w-20 accent-purple-600" />
              <span className="text-sm font-bold text-gray-700">{k}</span>
            </div>
            <button onClick={() => addLabeledPoint("red")} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">+ Red</button>
            <button onClick={() => addLabeledPoint("blue")} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors">+ Blue</button>
            <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="flex gap-6 items-start">
            <svg ref={svgRef} onClick={handleClick} width="400" height="400"
              className="bg-gray-50 rounded-xl border border-gray-200 cursor-crosshair shrink-0">
              <rect width="400" height="400" fill="#f8fafc" />
              {[...Array(8)].map((_, i) => (
                <line key={i} x1={i * 50} y1={0} x2={i * 50} y2={400} stroke="#e2e8f0" strokeWidth={0.5} />
              ))}
              {[...Array(8)].map((_, i) => (
                <line key={i} x1={0} y1={i * 50} x2={400} y2={i * 50} stroke="#e2e8f0" strokeWidth={0.5} />
              ))}
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={6} fill={p.label === "red" ? "#ef4444" : "#3b82f6"}
                  stroke="#fff" strokeWidth={2} className="cursor-pointer" />
              ))}
              {prediction && (
                <>
                  <circle cx={prediction.x} cy={prediction.y} r={8}
                    fill="none" stroke={prediction.predicted === "red" ? "#ef4444" : "#3b82f6"}
                    strokeWidth={3} strokeDasharray="4,2" />
                  <circle cx={prediction.x} cy={prediction.y} r={3}
                    fill={prediction.predicted === "red" ? "#ef4444" : "#3b82f6"} />
                </>
              )}
            </svg>
            <div className="flex-1 space-y-3">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-800 leading-relaxed">{message}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Legend</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-gray-600">Red (class A)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-600">Blue (class B)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-dashed border-gray-400 bg-transparent" />
                    <span className="text-xs text-gray-600">Prediction</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Click anywhere on the chart. The KNN algorithm finds the k nearest training points and predicts the majority class. Try adding more points and see how the decision boundary changes!
              </p>
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between supervised and unsupervised learning?",
               "Supervised learning uses labeled data (input-output pairs) to predict outputs for new inputs. Unsupervised learning finds patterns in unlabeled data without predefined outputs."],
              ["What is overfitting and how do you prevent it?",
               "Overfitting occurs when a model learns training data noise instead of the underlying pattern. Prevention: more data, feature reduction, regularization (L1/L2), cross-validation, early stopping, simpler models."],
              ["Explain the bias-variance tradeoff.",
               "Bias is error from underfitting (model too simple). Variance is error from overfitting (model too complex). The tradeoff: increasing model complexity reduces bias but increases variance. The goal is to minimize total error."],
              ["What is k-fold cross-validation?",
               "Data is split into k equal folds. The model trains on k-1 folds and validates on the remaining fold, rotating k times. The final score is the average across all folds—more reliable than a single train/test split."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-sm font-bold text-purple-900 mb-1">Q: {q}</p>
                <p className="text-xs text-purple-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
