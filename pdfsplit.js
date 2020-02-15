const path =  require ("path"); 
const fs = require ("fs"); 
const PDFImage = require("pdf-image").PDFImage; 

class PdfHandling { 

    createTempBookFolder(bookId){
        const dir = `./public/tmp/${bookId}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        return dir; 
    }

    addBookToFolder(bookId, fileName){
        const file = path.join(__dirname,`../uploads/${bookId}/${fileName}`); 
        const dest = path.join(__dirname,`../tmp/${bookId}/book${bookId}.pdf`);
        fs.rename(file, dest, (err) =>{
            if (err) throw err; 
        }); 
        return dest; 
    }

    async createImages(bookId){
        console.log("Into the create images method"); 
        const pdfFile =  `./public/tmp/${bookId}/book${bookId}.pdf`; 
        const pdfImage = new PDFImage(pdfFile);
        let imagePaths = await pdfImage.convertFile()
        let imgPathObj = {}; 
        for (let i=0; i<imagePaths.length; i++){
            imgPathObj[`image ${i}`] = imagePaths[i]; 
        }  
        return imgPathObj; 
    }

    deleteTempBookFolder(bookId){
        const tempFolder = path.join(__dirname, `/public/tmp/${bookId}`); 
        fs.readdirSync(tempFolder).filter((file) => {
            fs.unlinkSync(path.join(tempFolder, file));
        });
        fs.rmdirSync(tempFolder); 
        console.log("deleted folder "+ bookId); 
    }

    // deleteUploadsBookFolder(bookId){
    //     const uploadsFolder = path.join(__dirname, `/uploads/${bookId}`); 
    //     fs.readdirSync(uploadsFolder).filter((file) => {
    //         fs.unlinkSync(path.join(uploadsFolder, file));
    //     });
    //     fs.rmdirSync(uploadsFolder); 
    // }

    // deleteDownloadsBookFolder(bookId){
    //     const downloadsFolder = path.join(__dirname, `/downloads/${bookId}`); 
    //     fs.readdirSync(downloadsFolder).filter((file) => {
    //         fs.unlinkSync(path.join(downloadsFolder, file));
    //     });
    //     fs.rmdirSync(downloadsFolder); 
    // }

}

module.exports= PdfHandling; 

