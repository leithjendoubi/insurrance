import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
/* const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
}; */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const __directory = path.relative(__dirname ,__dirname + "/uploads/");
        cb(null, __directory); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploadFile = multer({ storage: storage })