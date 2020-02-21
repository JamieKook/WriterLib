const path =  require ("path"); 
const fs = require ("fs"); 
const PDFImage = require("pdf-image").PDFImage; 
const pdf = require('pdf-poppler');


class PdfHandling { 

    async otherCreate(bookId){
        let file = `./public/tmp/${bookId}/book${bookId}.pdf`; 
        
        let opts = {
            format: 'jpeg',
            out_dir: path.dirname(file),
            out_prefix: path.baseName(file, path.extname(file)),
            page: null
        }
        
        pdf.convert(file, opts)
            .then(res => {
                console.log('Successfully converted');
            })
            .catch(error => {
                console.error(error);
            })

        const outputFolder = path.join(__dirname, "/output"); 
    }

    createTempBookFolder(bookId){
        const dir = `./public/tmp/${bookId}`;
        //check to see if folder already exists
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        } else {
            //if it does remove old timestap
            fs.readdirSync(dir).filter((file) => {
                if (parseInt(file)){
                    fs.unlinkSync(path.join(dir, file));
                }
            }); 
        } 
        //add timestap file
        const time = Date.now(); 
        fs.writeFileSync(`${dir}/${time}`, time); 
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
        try {
        const pdfFile =  `./public/tmp/${bookId}/book${bookId}.pdf`; 
        const pdfImage = new PDFImage(pdfFile);
        const imagePaths = await pdfImage.convertFile();
        let imgPathObj = {}; 
        for (let i=0; i<imagePaths.length; i++){
            imgPathObj[`image ${i}`] = imagePaths[i]; 
        }  
        console.log(`pdfHanding return: ${imgPathObj}`); 
        return imgPathObj;
        } catch (err) {
            console.log(err); 
        }
       
    }

    deleteTempBookFolder(bookId){
        const tempFolder = path.join(__dirname, `/public/tmp/${bookId}`); 
        fs.readdirSync(tempFolder).filter((file) => {
            fs.unlinkSync(path.join(tempFolder, file));
        });
        fs.rmdirSync(tempFolder); 
        console.log("deleted folder "+ bookId); 
    }


    deleteOldTempBookFolder(){
        const currentTime = Date.now(); 
        console.log(`the current time is ${currentTime}`); 
        const tempFolder = (`./public/tmp`); 
        fs.readdirSync(tempFolder).filter((folder) => {
            let isOld=false; 
            let folderName = `./public/tmp/${folder}`; 
            fs.readdirSync(folderName).filter((file) => {
                //checks to see if folder has been there for longer than an hour
               const hourOld= parseInt(file)+ 3.6e+6; 
               console.log(`the expiration is ${hourOld}`); 
                if (hourOld < currentTime){
                    isOld=true; 
                    console.log(folderName); 
                    const oldPdf = folderName.replace("./public/tmp/", "book")+".pdf";
                    console.log(oldPdf); 
                    fs.unlinkSync(path.join(folderName, file));
                    fs.unlinkSync(path.join(folderName, oldPdf)); 
                } else{
                    const oldPdf = folderName.replace("./public/tmp/", "book")+".pdf";
                    console.log(oldPdf); 
                }; 
            });
            if (isOld){
                fs.rmdirSync(folderName); 
                console.log("removed old folder"); 
            } else {
                console.log("file is still new"); 
            }
        });
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

