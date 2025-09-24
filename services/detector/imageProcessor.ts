// import * as tf from '@tensorflow/tfjs';
// import { decodeJpeg } from '@tensorflow/tfjs-react-native';
// import * as FileSystem from 'expo-file-system';

// export async function preprocessImage(
//   imageUri: string,
//   size: number[] = [224, 224]
// ): Promise<tf.Tensor4D> {
//   const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });
//   const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
//   const raw = new Uint8Array(imgBuffer);
//   const imageTensor = decodeJpeg(raw);

//   const resized = tf.image.resizeBilinear(imageTensor, size);
//   const normalized = resized.div(255.0).expandDims(0) as tf.Tensor4D;

//   tf.dispose([imageTensor, resized]); // cleanup intermediate tensors
//   return normalized;
// }
