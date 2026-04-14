import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ["image/*"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only .jbg .jpeg .png .pdf are accepted"));
  }
};
export const UploadImage = multer({
  storage,
});
