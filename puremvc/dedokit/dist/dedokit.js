import { readdirSync, mkdirSync, lstatSync, existsSync, unlinkSync, rmdirSync } from 'fs';
import { join, extname, basename } from 'path';

var dedokit;
(function (dedokit) {
    (function (fs) {
        /**
         * 获取目标目录中的所有子文件数组
         * @param root 目标目录
         * @returns
         */
        function getDirectories(root) {
            return readdirSync(root, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => join(root, dirent.name));
        }
        fs.getDirectories = getDirectories;
        /**
         * 获取目标目录中的所有子文件数组（遍历子目录）
         * @param root 目标目录
         * @returns
         */
        function getDirectoriesDeep(root) {
            let directories = getDirectories(root);
            for (let directorie of directories) {
                directories = directories.concat(getDirectoriesDeep(directorie));
            }
            return directories;
        }
        fs.getDirectoriesDeep = getDirectoriesDeep;
        /**
         * 创建文件夹
         * 需要注意的是，fs.mkdirSync 默认只能创建一级目录。
         * 如果你需要创建多级目录（即目录中的目录），你可以使用 { recursive: true } 选项，
         * 但这在 Node.js 10.12.0 或更高版本中才可用：
         * @param dirPath
         */
        function mkdirDeep(dirPath) {
            mkdirSync(dirPath, { recursive: true });
        }
        fs.mkdirDeep = mkdirDeep;
        /**
         * 遍历目标目录，然会符合条件的文件数组
         * @param root 目标目录
         * @param paths 符合条件的文件数组
         * @param ext 文件扩展名或扩展名数组
         * @returns 符合条件的文件数组
         */
        function readdirSyncDeep(root, paths, ext) {
            let fileNames = readdirSync(root);
            for (let fileName of fileNames) {
                if (fileName.charAt(0) === ".")
                    continue;
                let filePath = join(root, fileName);
                let stat = lstatSync(filePath);
                if (stat.isDirectory()) {
                    readdirSyncDeep(filePath, paths, ext);
                }
                else if (stat.isFile()) {
                    let fileExt = extname(fileName);
                    if (typeof ext === "string") {
                        if (fileExt !== ext)
                            continue;
                    }
                    else if (Array.isArray(ext)) {
                        if (ext.indexOf(fileExt) < 0)
                            continue;
                    }
                    paths.push(filePath);
                }
            }
            return paths;
        }
        fs.readdirSyncDeep = readdirSyncDeep;
        /**
         * 删除目标目录（即使非空）
         * node本身的fs.rmdirSync方法 只能删除空文件夹
         * @param root 目标目录
         * @returns
         */
        function rmdirSyncDeep(root) {
            try {
                if (!existsSync(root))
                    return false;
                let fileNames = readdirSync(root);
                for (let fileName of fileNames) {
                    let filePath = join(root, fileName);
                    if (lstatSync(filePath).isDirectory()) {
                        rmdirSyncDeep(filePath);
                    }
                    else {
                        unlinkSync(filePath);
                    }
                }
                rmdirSync(root);
            }
            catch (error) {
                console.error(error);
                return false;
            }
            return true;
        }
        fs.rmdirSyncDeep = rmdirSyncDeep;
        /**
         * 删除目标文件或文件夹
         * node本身的fs.rmdirSync方法 只能删除空文件夹
         * @param dirOrFile 目标
         * @returns
         */
        function rmSyncForce(dirOrFile) {
            if (!existsSync(dirOrFile))
                return false;
            if (lstatSync(dirOrFile).isDirectory()) {
                return rmdirSyncDeep(dirOrFile);
            }
            try {
                unlinkSync(dirOrFile);
            }
            catch (error) {
                console.error(error);
                return false;
            }
            return true;
        }
        fs.rmSyncForce = rmSyncForce;
    })(dedokit.fs || (dedokit.fs = {}));
})(dedokit || (dedokit = {}));

// let paths = dedokit.fs.deepSearchSync("G:\\work_space\\webpack", [], ".json");
// console.log("paths.length------>", paths.length);
// for (let p of paths) {
//     console.log("p---->", p);
// }
// dedokit.fs.rmdirSyncDeep("./dist/del");
//  d.fs.log("ddd");

console.log(basename("./dist/del/tsconfig.json"));
