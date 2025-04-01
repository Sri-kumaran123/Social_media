import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

try:
    # Load dataset (Ensure train.csv is in the same directory)
    df = pd.read_csv("D:\\toxic_comments3\\train.csv")
except PermissionError as e:
    print(f"PermissionError: {e}")
    exit(1)
except OSError as e:
    print(f"OSError: {e}")
    exit(1)

# Create a single binary label: if any of the six categories is 1, mark as toxic (1), else non-toxic (0)
df['toxic_label'] = df.iloc[:, 2:].max(axis=1)

# Splitting data into training and testing
X_train, X_test, y_train, y_test = train_test_split(df['comment_text'], df['toxic_label'], test_size=0.2, random_state=42)

# Create text processing + classification pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=10000, stop_words="english")),
    ("classifier", LogisticRegression())
])

# Train the model
model.fit(X_train, y_train)

# Save the trained model
with open("toxic_comment_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved as 'toxic_comment_model.pkl'.")
