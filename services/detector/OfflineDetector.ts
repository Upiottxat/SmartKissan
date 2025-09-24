import * as tf from '@tensorflow/tfjs';
import { loadGraphModel, loadLabels } from './modelLoader';
import { preprocessImage } from './imageProcessor';

export interface DetectionResult {
  disease: string;
  confidence: number;
}

class OfflineDetector {
  private model: tf.GraphModel | null = null;
  private labels: string[] = [];

  async init(): Promise<void> {
    if (this.model) return;
    console.log('Loading offline model...');
    this.labels = await loadLabels();
    this.model = await loadGraphModel();
    console.log('Offline model loaded successfully!');
  }

  async detectDisease(imageUri: string): Promise<DetectionResult | null> {
    if (!this.model) {
      console.warn('Model not loaded yet. Call init() first.');
      return null;
    }

    try {
      const inputTensor = await preprocessImage(imageUri);
      const result = this.model.predict(inputTensor) as tf.Tensor;
      const resultData = await result.data();

      let maxConfidence = 0;
      let detectedIndex = -1;
      resultData.forEach((c, i) => {
        if (c > maxConfidence) {
          maxConfidence = c;
          detectedIndex = i;
        }
      });

      tf.dispose([inputTensor, result]);

      if (detectedIndex !== -1 && maxConfidence > 0.6) {
        return {
          disease: this.labels[detectedIndex],
          confidence: maxConfidence,
        };
      }
      return null;
    } catch (err) {
      console.error('Error during offline detection:', err);
      return null;
    }
  }
}

export const offlineDetector = new OfflineDetector();
