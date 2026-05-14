"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Cpu, Network, Box, Layers } from "lucide-react";

export default function DeepLearningPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Deep Learning</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Deep Learning</h1>
              <p className="text-gray-500 text-sm">Neural networks, architectures, and Keras in practice.</p>
            </div>
          </div>
        </div>

        {/* Neural Network Architecture */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-rose-500" /> Neural Network Architecture
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            A neural network consists of layers of interconnected neurons. Each neuron applies a weighted sum of inputs, adds a bias, and passes through a non-linear activation function. Deep networks stack multiple hidden layers.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import tensorflow as tf
from tensorflow import keras

# Build a simple feed-forward network
model = keras.Sequential([
    # Input: 784 features (e.g. 28x28 flattened image)
    keras.layers.Dense(128, activation="relu", input_shape=(784,)),
    keras.layers.Dropout(0.2),       # regularization
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation="softmax")  # output
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

print(model.summary())`}</pre>
          </div>
        </div>

        {/* Activation Functions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-500" /> Activation Functions
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Activation functions introduce non-linearity, enabling networks to learn complex patterns. Each has different properties for different use cases.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              ["ReLU", "f(x) = max(0, x)", "Most common hidden layer activation; cheap, avoids vanishing gradient"],
              ["Sigmoid", "f(x) = 1/(1+e⁻ˣ)", "Outputs 0–1, used for binary classification; suffers vanishing gradient"],
              ["Tanh", "f(x) = tanh(x)", "Outputs -1 to 1; zero-centered; better than sigmoid in hidden layers"],
              ["Softmax", "f(x) = eˣ/Σeˣ", "Outputs probability distribution over classes; used in output layer"],
              ["Leaky ReLU", "f(x) = max(αx, x)", "Fixes dying ReLU problem with small negative slope"],
              ["GELU", "xΦ(x)", "Used in transformers (GPT, BERT); smooth approximation of ReLU"],
            ].map(([name, eq, desc]) => (
              <div key={name} className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-sm font-bold text-rose-800">{name}</p>
                <p className="text-xs font-mono text-rose-600 mt-0.5">{eq}</p>
                <p className="text-[10px] text-rose-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CNN, RNN, Transformers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" /> CNN, RNN & Transformers
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            CNNs use convolutional filters to capture spatial patterns (images). RNNs process sequential data with hidden state (text, time series). Transformers use self-attention to handle long-range dependencies without recurrence.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# CNN for image classification
cnn = keras.Sequential([
    keras.layers.Conv2D(32, (3,3), activation="relu", input_shape=(32,32,3)),
    keras.layers.MaxPooling2D(2,2),
    keras.layers.Conv2D(64, (3,3), activation="relu"),
    keras.layers.MaxPooling2D(2,2),
    keras.layers.Flatten(),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dense(10, activation="softmax")
])

# Simple RNN for text
rnn = keras.Sequential([
    keras.layers.Embedding(10000, 128),
    keras.layers.SimpleRNN(64, return_sequences=True),
    keras.layers.SimpleRNN(32),
    keras.layers.Dense(1, activation="sigmoid")
])

# Transformer block (simplified)
from keras.layers import MultiHeadAttention, LayerNormalization

def transformer_block(x, d_model, num_heads):
    attn = MultiHeadAttention(num_heads=num_heads, key_dim=d_model)(x, x)
    x = LayerNormalization()(x + attn)  # add & norm
    return x`}</pre>
          </div>
        </div>

        {/* Full Keras Example */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Complete Keras Training Loop</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            A full pipeline: load data, build a model, train with early stopping, and evaluate on test data.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.datasets import mnist

# 1. Load and preprocess data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.reshape(-1, 784).astype("float32") / 255.0
x_test = x_test.reshape(-1, 784).astype("float32") / 255.0

# 2. Build model
model = keras.Sequential([
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation="softmax")
])

model.compile(optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"])

# 3. Train with early stopping
early_stop = keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=3, restore_best_weights=True
)

history = model.fit(x_train, y_train,
    batch_size=32, epochs=20,
    validation_split=0.2,
    callbacks=[early_stop],
    verbose=1)

# 4. Evaluate
test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)
print(f"Test accuracy: {test_acc:.4f}")  # ~98% on MNIST`}</pre>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the vanishing gradient problem and how do you fix it?",
               "Vanishing gradient occurs when gradients become very small in deep networks, preventing early layers from learning. Fixes: use ReLU activation, batch normalization, residual connections (ResNet), or LSTMs for RNNs."],
              ["Explain the difference between CNNs and RNNs.",
               "CNNs use convolutional filters to detect spatial patterns in grid-like data (images). They use weight sharing and pooling. RNNs maintain hidden state to process sequential data (text, audio) and can handle variable-length inputs."],
              ["What is a transformer and how does self-attention work?",
               "A transformer is a model architecture based entirely on self-attention, without recurrence. Self-attention computes weighted averages of all positions in a sequence, allowing the model to capture long-range dependencies in parallel."],
              ["What is dropout and why is it used?",
               "Dropout randomly sets a fraction of neurons to zero during training, forcing the network to learn redundant representations. It is a regularization technique that reduces overfitting."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-sm font-bold text-rose-900 mb-1">Q: {q}</p>
                <p className="text-xs text-rose-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
