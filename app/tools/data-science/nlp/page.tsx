"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, GitBranch, BookOpen, Search } from "lucide-react";

export default function NLPPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">NLP</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Natural Language Processing</h1>
              <p className="text-gray-500 text-sm">Text preprocessing, embeddings, and modern NLP with transformers.</p>
            </div>
          </div>
        </div>

        {/* Text Preprocessing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-500" /> Text Preprocessing
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Raw text is messy. Preprocessing steps clean and normalize text before feeding into models: lowercasing, removing punctuation/tags, stemming/lemmatization, and removing stop words.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer

text = "The cats are running quickly! <br> They're playing."

# 1. Lowercase
text = text.lower()

# 2. Remove HTML tags
text = re.sub(r'<[^>]+>', '', text)

# 3. Remove punctuation & digits
text = re.sub(r'[^\\w\\s]', '', text)

# 4. Tokenize
tokens = nltk.word_tokenize(text)
print(f"Tokens: {tokens}")

# 5. Remove stop words
stop_words = set(stopwords.words('english'))
tokens = [t for t in tokens if t not in stop_words]

# 6. Stemming
stemmer = PorterStemmer()
stems = [stemmer.stem(t) for t in tokens]
print(f"Stems: {stems}")

# 7. Lemmatization
lemmatizer = WordNetLemmatizer()
lemmas = [lemmatizer.lemmatize(t) for t in tokens]
print(f"Lemmas: {lemmas}")`}</pre>
          </div>
        </div>

        {/* Tokenization & Embeddings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" /> Tokenization & Embeddings
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Tokenization splits text into tokens (words, subwords, or characters). Embeddings map tokens to dense vector representations that capture semantic meaning. Word2Vec, GloVe, and BERT embeddings are common.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Word-level tokenization
texts = ["I love NLP", "Deep learning is amazing", "I love transformers"]
tokenizer = Tokenizer(num_words=10000)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
print(f"Sequences: {sequences}")
print(f"Word index: {tokenizer.word_index}")

# Padding to equal length
padded = pad_sequences(sequences, maxlen=5, padding="post")
print(f"Padded: {padded}")

# Simple embedding layer
from tensorflow.keras.layers import Embedding
embedding = Embedding(input_dim=10000, output_dim=128, input_length=5)
# This learns dense 128-dim vectors for each token

# Pre-trained embeddings (GloVe)
# Load glove.6B.100d.txt → create embedding matrix
# embedding_layer.set_weights([embedding_matrix])`}</pre>
          </div>
        </div>

        {/* Transformers & BERT */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-violet-500" /> Transformers & BERT
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            BERT (Bidirectional Encoder Representations from Transformers) is a pre-trained transformer model that understands context from both left and right. It set new benchmarks on 11 NLP tasks and powers modern NLP pipelines.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`from transformers import pipeline

# Sentiment analysis with pre-trained transformer
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

result = classifier("I absolutely loved this movie!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]

result = classifier("The service was terrible and slow.")
print(result)
# [{'label': 'NEGATIVE', 'score': 0.9987}]

# Feature extraction (embeddings)
extractor = pipeline("feature-extraction", model="bert-base-uncased")
features = extractor("Transformers are powerful.")
print(f"Shape: {len(features[0])} tokens x {len(features[0][0])} dims")`}</pre>
          </div>
        </div>

        {/* Sentiment Analysis Example */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Build: Sentiment Classifier</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            A complete text classification pipeline using TF-IDF features and a logistic regression model — lightweight and interpretable.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

texts = [
    "This product is amazing!", "Worst purchase ever.",
    "Really happy with this", "Not worth the money",
    "Excellent quality", "Terrible customer service",
    "I love it", "Very disappointed",
    "Highly recommend", "Do not buy this"
]
labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]  # 1 = positive, 0 = negative

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.3, random_state=42
)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=1000)),
    ("clf", LogisticRegression())
])

pipeline.fit(X_train, y_train)
accuracy = pipeline.score(X_test, y_test)
print(f"Test accuracy: {accuracy:.2f}")

# Predict new text
new = ["This is fantastic!"]
pred = pipeline.predict(new)
print(f"Prediction: {'positive' if pred[0] else 'negative'}")`}</pre>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between stemming and lemmatization?",
               "Stemming crudely chops prefixes/suffixes (e.g., 'running' → 'run'). Lemmatization uses dictionaries to return the base dictionary form (e.g., 'better' → 'good'). Lemmatization is more accurate but slower."],
              ["What are word embeddings and why are they used?",
               "Word embeddings are dense vector representations of words where semantically similar words are close in vector space (e.g., king - man + woman ≈ queen). They capture meaning better than sparse bag-of-words representations."],
              ["How does a transformer differ from an RNN/LSTM?",
               "Transformers process all tokens in parallel using self-attention, avoiding the sequential bottleneck of RNNs. This enables much faster training and better handling of long-range dependencies, which is why transformers dominate modern NLP."],
              ["What is BERT and how is it fine-tuned?",
               "BERT is a bidirectional transformer pre-trained on masked language modeling and next-sentence prediction. Fine-tuning adds a task-specific head (e.g., classification) and trains on labeled data while updating all or some parameters."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-sm font-bold text-indigo-900 mb-1">Q: {q}</p>
                <p className="text-xs text-indigo-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
