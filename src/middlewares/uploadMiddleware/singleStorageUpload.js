const multer = require('multer');
const path = require('path');
const { slugify } = require('transliteration');

const fileFilter = require('./utils/LocalfileFilter');

const singleStorageUpload = ({
  entity,
  fileType = 'default',
  uploadFieldName = 'file',
  fieldName = 'file',
}) => {
  var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `src/public/uploads/${entity}`);
    },
    filename: function (req, file, cb) {
      try {
        let fileExtension = path.extname(file.originalname);
        let uniqueFileID = Math.random().toString(36).slice(2, 7);

        let originalname = req.body.seotitle
          ? slugify(req.body.seotitle.toLocaleLowerCase())
          : slugify(file.originalname.split('.')[0].toLocaleLowerCase());

        let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

        const filePath = `public/uploads/${entity}/${_fileName}`;

        req.upload = {
          fileName: _fileName,
          fieldExt: fileExtension,
          entity: entity,
          fieldName: fieldName,
          fileType: fileType,
          filePath: filePath,
        };

        req.body[fieldName] = filePath;
        console.log(req.upload);

        cb(null, _fileName);
      } catch (error) {
        console.log('Error during filename operation:', error);
        cb(error); // Pass the error to the callback
      }
    },
  });

  let filterType = fileFilter(fileType);

  const multerStorage = multer({ storage: diskStorage, fileFilter: filterType }).single('file');
  return multerStorage;
};

module.exports = singleStorageUpload;
