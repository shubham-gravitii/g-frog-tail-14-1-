import nextConnect from 'next-connect';
import multer from 'multer';
import sharp from 'sharp';

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});


// Process a POST request with image
apiRoute.use(upload.single('image'));

apiRoute.post(async (req, res) => {
  try {
    console.clear()
    console.log(req.file.buffer)
    const imageBuffer = req.file.buffer;

    const compressedImage = await sharp(imageBuffer)
      .resize(1200, 900)
      .toBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="compressed-image.jpg"'
    );

    return res.end(compressedImage);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Image compression failed" });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing because we're using multer
  },
};

export default apiRoute;