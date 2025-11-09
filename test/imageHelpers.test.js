import { jest } from '@jest/globals'
import sharp from 'sharp';
import { calculateRunwareDimensions } from '../src/services/imageHelpers.js';

describe('calculateRunwareDimensions', () => {
  test('should return dimensions within maxPixels limit after rounding', async () => {
    const options = {
      minPixels: 1024,
      maxPixels: 1048576,
      minDimension: 128,
      maxDimension: 2048,
    };

    // Create a dummy image that is large and would've triggered the bug
    const inputImage = sharp({
        create: {
          width: 1500,
          height: 2130,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      }).png().toBuffer();

    const result = await calculateRunwareDimensions(inputImage, options);

    expect(result.width * result.height).toBeLessThanOrEqual(options.maxPixels);
    expect(result.width % 32).toBe(0);
    expect(result.height % 32).toBe(0);
  });
});
