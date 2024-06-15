/* eslint-disable @typescript-eslint/no-inferrable-types */
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from './utils';
import dayjs = require('dayjs');

export function getFileExtension(filename: string) {
  return filename.split('.').pop();
}

export const removeFile = (path: string) => {
  if (!fs.existsSync(`${process.cwd()}/public${path}`)) {
    return null;
  }
  fs.unlinkSync(`${process.cwd()}/public${path}`);
  return path;
};

export const saveFile = async (
  imageFile: any,
  envUploadPath: string,
  auth = { id: 'unknown' }
): Promise<string> => {
  // console.log('aaaa', imageFile == undefined);
  if (!imageFile || !imageFile?.buffer) throw new Error('Invalid image');
  const typeImage = getFileExtension(imageFile?.originalname);
  if (!typeImage) {
    throw new Error('Invalid type image');
  }
  //   const allowTypes = ['jpg', 'png', 'jpeg'];
  //   if (!allowTypes.includes(typeImage)) throw new Error('Invalid type image');
  // console.log(process.cwd())
  const publicFolder = path.join(
    process.cwd(),
    process.env['STATIC_PATH'] || ''
  );
  console.log('publicFolder', publicFolder);
  const uploadFolder = path.join(publicFolder, envUploadPath);
  console.log('uploadFolder', uploadFolder);

  const pathToFolder: string = path.join(
    uploadFolder,
    `user_${auth.id}`,
    dayjs().format('DD-MM-YYYY')
  );
  const name = `${uuidv4()}.${typeImage}`;
  const pathToImage: string = path.join(pathToFolder, name);

  if (!fs.existsSync(pathToFolder)) {
    fs.mkdirSync(pathToFolder, { recursive: true });
  }
  fs.writeFileSync(pathToImage, imageFile.buffer);

  return path.join(
    envUploadPath,
    `user_${auth.id}`,
    dayjs().format('DD-MM-YYYY'),
    name
  );
};

/**
 * @Description
 *  - Lấy đường dẫn file tồn tại tại
 *  - Có thể cài đặt check file tồn tại
 *
 * @Param {string[]} pathfiles
 * @Param {number} timeCheck  milisecond
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export async function getPathFilesExist(
  pathFiles: string[],
  timeWait: number = 0
) {
  let delay = 1000 * 20; // 20s
  let pathFileExits: string[] = [];
  if (timeWait < delay) {
    delay = timeWait;
  }
  do {
    pathFileExits = pathFiles.filter((file) => fs.pathExistsSync(file));
    if (pathFileExits.length === pathFiles.length || timeWait <= 0) {
      break;
    } else {
      await sleep(delay);
      timeWait -= delay;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
  return pathFileExits;
}
