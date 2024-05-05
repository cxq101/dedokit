import { existsSync, lstatSync, mkdirSync, Mode, readdirSync, rmdirSync, unlinkSync } from "fs";
import { dirname, extname, join } from "path";

/**
 * 获取目标目录中的所有子文件数组
 * @param root 目标目录
 * @returns 
 */
export function getDirectories(root: string): string[] {
    return readdirSync(root, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => join(root, dirent.name));
}

/**
 * 获取目标目录中的所有子文件数组（遍历子目录）
 * @param root 目标目录
 * @returns 
 */
export function getDirectoriesDeeply(root: string): string[] {
    let directories = getDirectories(root);
    for (let directorie of directories) {
        directories = directories.concat(getDirectoriesDeeply(directorie));
    }
    return directories;
}

/**
 * 创建文件夹
 * 需要注意的是，fs.mkdirSync 默认只能创建一级目录。
 * 如果你需要创建多级目录（即目录中的目录），你可以使用 { recursive: true } 选项，
 * 但这在 Node.js 10.12.0 或更高版本中才可用：
 * @param dirPath 
 */
export function mkdirDeeply(dirPath: string): void {
    mkdirSync(dirPath, { recursive: true });
}

/**
 * 遍历目标目录，然会符合条件的文件数组
 * @param root 目标目录
 * @param paths 符合条件的文件数组
 * @param ext 文件扩展名或扩展名数组
 * @returns 符合条件的文件数组
 */
export function readdirSyncDeeply(root: string, paths: string[], ext: string | string[]): string[] {
    let fileNames = readdirSync(root);
    for (let fileName of fileNames) {
        if (fileName.charAt(0) === ".") continue;
        let filePath = join(root, fileName);
        let stat = lstatSync(filePath);
        if (stat.isDirectory()) {
            readdirSyncDeeply(filePath, paths, ext);
        } else if (stat.isFile()) {
            let fileExt = extname(fileName);
            if (typeof ext === "string") {
                if (fileExt !== ext) continue;
            } else if (Array.isArray(ext)) {
                if (ext.indexOf(fileExt) < 0) continue;
            }
            paths.push(filePath);
        }
    }
    return paths;
}

/**
 * 删除目标目录（即使非空）
 * node本身的fs.rmdirSync方法 只能删除空文件夹
 * @param root 目标目录
 * @returns 
 */
export function rmdirSyncDeeply(root: string): boolean {
    try {
        if (!existsSync(root)) return false;
        let fileNames = readdirSync(root);
        for (let fileName of fileNames) {
            let filePath = join(root, fileName);
            if (lstatSync(filePath).isDirectory()) {
                rmdirSyncDeeply(filePath);
            } else {
                unlinkSync(filePath);
            }
        }
        rmdirSync(root);
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

/**
 * 删除目标文件或文件夹
 * node本身的fs.rmdirSync方法 只能删除空文件夹
 * @param dirOrFile 目标
 * @returns 
 */
export function rmSyncForce(dirOrFile: string): boolean {
    if (!existsSync(dirOrFile)) return false;
    if (lstatSync(dirOrFile).isDirectory()) {
        return rmdirSyncDeeply(dirOrFile);
    }
    try {
        unlinkSync(dirOrFile);
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

/**
 * 从当前目录逐层向上查找目标文件
 * @param startDir 起始目录
 * @param fileName 目标文件
 * @returns 
 */
export function findFileUpwards(startDir: string, fileName: string): string | null {
    let currDir = startDir;
    while(true) {
        // 检查当前目录是否包含文件  
        let filePath = join(currDir, fileName);
        if (existsSync(filePath)) {
            return filePath;
        }
        // 如果没有找到文件，尝试向上查找  
        let parentDir = dirname(currDir);
        if (parentDir === currDir) {
            return null;
        }
        // 更新当前目录为父目录
        currDir = parentDir;
    }
}

