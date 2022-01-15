import supertest from 'supertest';
import app from '../index';
import sharp from 'sharp';

const request = supertest(app);
describe('Test endpoint responses', () => {
  it('gets the api endpoint and make sure that it returns OK', async (done) => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
    done();
  });

  it('gets the original image when requested without width and height', async (done) => {
    const response = await request.get('/api/images?name=udacity-logo.png');
    const imageMetadata = await sharp(response.body).metadata();
    expect(response.status).toBe(200);
    expect(imageMetadata.width).toBe(400);
    expect(imageMetadata.height).toBe(400);
    done();
  });

  it('returns 404 and an error message when the image is not found', async (done) => {
    const response = await request.get('/api/images?name=test.png');
    expect(response.status).toBe(404);
    expect(response.text).toBe("POOF! That image doesn't exist!");
    done();
  });

  it('resizes the image and returns the new resized image', async (done) => {
    const response = await request.get(
      '/api/images?name=udacity-logo.png&width=100&height=100'
    );
    const imageMetadata = await sharp(response.body).metadata();
    expect(response.status).toBe(200);
    expect(imageMetadata.width).toBe(100);
    expect(imageMetadata.height).toBe(100);
    done();
  });
});
