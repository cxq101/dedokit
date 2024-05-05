import { join, dirname, basename } from "path";
import { existsSync } from "fs";
import { findFileUpwards, readdirSyncDeeply } from "../fs/FSKit";

export interface ITSConfigInfo {
    cfg: string[];
    common: string[];
}

function findTSConfig(projectRoot: string, targetRoot: string, isMiniGame: boolean): ITSConfigInfo | null {
    let tsconfigName = "tsconfig.json";
    let tsconfigPath = join(targetRoot, tsconfigName);

    // 如果当前文件夹还有tscofig 文件则只编译该文件夹
    if (existsSync(tsconfigPath)) {
        return { cfg: [tsconfigPath], common: [] };
    }

    // 遍历子文件夹 【全编译】
    let jsonFiles = readdirSyncDeeply(targetRoot, [], ".json");
    if (jsonFiles.length) {
        let common = ["main", "login", "entry", "common", "scene"];
        common = common.map(name => join(projectRoot, "core", "src", "game", name, tsconfigName));
        let hasCommon = false;
        let cfgList = [];
        for (let jsonFile of jsonFiles) {
            if (common.indexOf(jsonFile) > -1) {
                hasCommon = true;
                continue;
            }
            if (basename(jsonFile) !== tsconfigName) continue;
            if (jsonFile.indexOf("node_modules") > -1) continue;
            if (jsonFile.indexOf("tool") > -1) continue;
            if (!isMiniGame && jsonFile.replace(/\\/g, "/").indexOf("/minigame/") > -1) continue;
            cfgList.push(jsonFile);
        }
        if (cfgList.length || hasCommon) {
            return { cfg: cfgList, common: hasCommon ? common : [] };
        }
    }

    // 逐层向上查找tsconfig文件
    let tmpPath = findFileUpwards(targetRoot, tsconfigName);
    if (tmpPath) {
        return { cfg: [tmpPath], common: [] };
    }
    return null;
}

function build(businessModules: string[], commonModules: string[], declaration: boolean, sourceMap: boolean, projectRoot: string): void {
    
}

function start(projectRoot: string, targetRoot: string, declaration: boolean, sourceMap: boolean): void {
    let tsconfigInfo = findTSConfig(projectRoot, targetRoot, false);
    if(tsconfigInfo) {
        let { cfg, common } = tsconfigInfo;
        build(cfg, common, declaration, sourceMap, projectRoot);
    }
}
