import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

// Local asset imports
const modelJson = require('../assets/model.json');
const modelWeights = require('../assets/weights.bin');

export async function loadLabels(): Promise<string[]> {
  const labelsTxt = await FileSystem.readAsStringAsync(
    FileSystem.bundleDirectory + 'assets/labels.txt'
  );
  return labelsTxt.split('\n');
}

export async function loadGraphModel(): Promise<tf.GraphModel> {
  await tf.ready();
  const modelSource = bundleResourceIO(modelJson, modelWeights);
  return await tf.loadGraphModel(modelSource);
}
