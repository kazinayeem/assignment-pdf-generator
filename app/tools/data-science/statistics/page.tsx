"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, BarChart3, BellRing, Sigma, TrendingUp } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Statistics</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Statistics for Data Science</h1>
              <p className="text-gray-500 text-sm">Foundational statistical concepts for data analysis and ML.</p>
            </div>
          </div>
        </div>

        {/* Descriptive Statistics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Sigma className="w-4 h-4 text-cyan-500" /> Descriptive Statistics
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Descriptive statistics summarize data through measures of central tendency (mean, median, mode) and dispersion (range, variance, standard deviation, IQR).
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np
from scipy import stats

data = [12, 15, 14, 10, 18, 20, 14, 16, 13, 15]

mean = np.mean(data)
median = np.median(data)
mode = stats.mode(data, keepdims=True)
variance = np.var(data, ddof=1)  # sample variance
std = np.std(data, ddof=1)
q1, q3 = np.percentile(data, [25, 75])
iqr = q3 - q1

print(f"Mean: {mean:.2f}")
print(f"Median: {median}")
print(f"Mode: {mode.mode[0]}")
print(f"Std: {std:.2f}")
print(f"IQR: {iqr:.2f}")
# Skewness & Kurtosis
print(f"Skew: {stats.skew(data):.2f}")
print(f"Kurtosis: {stats.kurtosis(data):.2f}")`}</pre>
          </div>
        </div>

        {/* Probability Distributions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-500" /> Probability Distributions
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Distributions describe how probabilities are assigned to outcomes. Key distributions: Normal (bell curve), Binomial (yes/no trials), Poisson (event counts), and Uniform.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# Normal distribution
mu, sigma = 0, 1
norm_dist = stats.norm(mu, sigma)
x = np.linspace(-4, 4, 100)
pdf = norm_dist.pdf(x)       # probability density
cdf = norm_dist.cdf(x)       # cumulative prob

# Binomial distribution
n, p = 10, 0.5
binom_dist = stats.binom(n, p)
prob_6 = binom_dist.pmf(6)   # P(X = 6)

# Poisson distribution
lam = 3
poisson_dist = stats.poisson(lam)
prob_5 = poisson_dist.pmf(5) # P(X = 5) events

# Percentiles (z-score)
z = norm_dist.ppf(0.975)  # 1.96 — 95% confidence
print(f"95% CI z-score: {z:.3f}")

# Random sampling
samples = norm_dist.rvs(1000, random_state=42)
print(f"Sample mean: {samples.mean():.3f}")`}</pre>
          </div>
        </div>

        {/* Hypothesis Testing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Hypothesis Testing
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Hypothesis testing determines whether observed effects are statistically significant. Common tests: t-test (compare means), chi-squared (categorical), ANOVA (multiple groups).
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`from scipy import stats
import numpy as np

# One-sample t-test: is mean different from 100?
data = [98, 102, 97, 105, 99, 101, 96, 103]
t_stat, p_val = stats.ttest_1samp(data, 100)
print(f"t = {t_stat:.3f}, p = {p_val:.4f}")
# p < 0.05 → reject null hypothesis

# Two-sample t-test
group_a = np.random.normal(100, 10, 30)
group_b = np.random.normal(105, 10, 30)
t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"Two-sample t = {t_stat:.3f}, p = {p_val:.4f}")

# Chi-squared test
observed = [[10, 20], [15, 25]]
chi2, p, dof, expected = stats.chi2_contingency(observed)
print(f"Chi2 = {chi2:.3f}, p = {p:.4f}")

# p-value interpretation:
# p < 0.05 → statistically significant (95% confidence)
# p < 0.01 → highly significant (99% confidence)
# p > 0.05 → not significant`}</pre>
          </div>
        </div>

        {/* Correlation vs Causation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Correlation vs Causation</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Correlation measures the strength of a linear relationship between variables (Pearson&apos;s r, range -1 to 1). Causation implies one variable directly affects another. Correlation does NOT imply causation.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np
from scipy import stats

# Pearson correlation
x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 6])
r, p_val = stats.pearsonr(x, y)
print(f"Pearson r = {r:.3f}, p = {p_val:.4f}")

# Spearman rank correlation (non-parametric)
rho, p = stats.spearmanr(x, y)
print(f"Spearman rho = {rho:.3f}")

# Common pitfalls:
# - Spurious correlation: ice cream sales ← temp → drownings
# - Confounding variable: Z causes both X and Y
# - Reversed causation: does X cause Y or Y cause X?
# - Selection bias: cherry-picking data points`}</pre>
          </div>
          <div className="flex gap-3 text-center">
            <div className="flex-1 p-3 bg-green-50 rounded-xl border border-green-100">
              <p className="text-xs font-bold text-green-700">Correlation</p>
              <p className="text-[10px] text-green-600 mt-1">Two variables move together</p>
            </div>
            <div className="flex-1 p-3 bg-red-50 rounded-xl border border-red-100">
              <p className="text-xs font-bold text-red-700">Causation</p>
              <p className="text-[10px] text-red-600 mt-1">One causes the other</p>
            </div>
            <div className="flex-1 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-bold text-amber-700">Pitfall</p>
              <p className="text-[10px] text-amber-600 mt-1">Confusing the two</p>
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between descriptive and inferential statistics?",
               "Descriptive statistics summarize data (mean, median, std). Inferential statistics draw conclusions about populations from samples using hypothesis tests, confidence intervals, and regression."],
              ["Explain p-value and significance level.",
               "A p-value is the probability of observing the data (or more extreme) assuming the null hypothesis is true. A significance level α (typically 0.05) is the threshold: p < α means reject the null."],
              ["What is the Central Limit Theorem?",
               "CLT states that the sampling distribution of the sample mean approaches a normal distribution as sample size increases, regardless of the population's distribution. This justifies many parametric tests."],
              ["Why does correlation not imply causation?",
               "Confounding variables, reversed causation, and spurious correlations can produce high correlation without a causal link. Establishing causation requires controlled experiments (RCTs) or causal inference methods."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                <p className="text-sm font-bold text-cyan-900 mb-1">Q: {q}</p>
                <p className="text-xs text-cyan-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
