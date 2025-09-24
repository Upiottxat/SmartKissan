import * as FileSystem from 'expo-file-system';

// Define a type for the structure of your disease data for better code safety
export interface DiseaseInfo {
  symptoms: string[];
  cause: string;
  cure: {
    organic: string[];
    chemical: string[];
  };
}

class OfflineKnowledgeService {
  private database: Record<string, DiseaseInfo> | null = null;

  // Load the entire JSON database from assets into memory
  async loadDatabase(): Promise<void> {
    if (this.database) return; // Avoid loading more than once

    try {
      console.log("Loading offline disease database...");
    
      const dbUri = FileSystem.bundleDirectory + 'assets/disease_database.json';
      const dbJsonString = await FileSystem.readAsStringAsync(dbUri);
      this.database = JSON.parse(dbJsonString);
      console.log("Offline database loaded successfully!");
    } catch (error) {
      console.error("Failed to load offline disease database:", error);
    }
  }

  // Get the details for a specific disease by its name
  getDiseaseInfo(diseaseName: string): DiseaseInfo | null {
    if (!this.database) {
      console.warn("Database not loaded yet.");
      return null;
    }
    return this.database[diseaseName] || null;
  }
}

// Export a singleton instance so the database is only loaded once.
export const offlineKnowledgeService = new OfflineKnowledgeService();
