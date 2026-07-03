import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

class DataLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.scaler = StandardScaler()

    def load_data(self):
        """Loads data from CSV."""
        df = pd.read_csv(self.file_path)
        return df

    def preprocess(self, df: pd.DataFrame, is_training: bool = True):
        """
        Preprocesses the dataframe.
        - Drops non-predictive columns if necessary.
        - Scales the 'Amount' and 'Time' columns.
        """
        df_processed = df.copy()
        
        # Scale Time and Amount
        cols_to_scale = ['Time', 'Amount']
        
        if is_training:
            df_processed[cols_to_scale] = self.scaler.fit_transform(df_processed[cols_to_scale])
        else:
            df_processed[cols_to_scale] = self.scaler.transform(df_processed[cols_to_scale])
            
        return df_processed

    def get_train_test_split(self, test_size=0.2, random_state=42):
        """Returns X_train, X_test, y_train, y_test"""
        df = self.load_data()
        X = df.drop('Class', axis=1)
        y = df['Class']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        X_train_scaled = self.preprocess(X_train, is_training=True)
        X_test_scaled = self.preprocess(X_test, is_training=False)
        
        return X_train_scaled, X_test_scaled, y_train, y_test
