import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = "./public/uploads";

if(!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory,{recursive: true});
}

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, uploadDirectory);
    },
    filename : function (req,file,cb){
        const uniqueName = 
        Date.now() + "-" + Math.round(Math.random()*1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF files are allowed."),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 5*1024*1024,
    },
});

export {upload};