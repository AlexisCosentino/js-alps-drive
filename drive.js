const os = require('os');
const path = require('path')
const fs = require('fs/promises');
const { Dirent } = require('fs');


const ALPS_DRIVE = path.join(os.tmpdir(), 'test/');
console.log('Mon dossier racine de stockage ; ' + ALPS_DRIVE);

function createRootFolder(){
    const promise = fs.access(ALPS_DRIVE)
    .then(() => {
        console.log('Le dossier existe deja');
    }).catch(() => {
        return fs.mkdir(ALPS_DRIVE);
    })
    return promise
}

function listFolder(path){
 return fs.readdir(path, { withFileTypes: true }).then((result)=>{
    const myResult = [];
    result.forEach(element => {
        myResult.push({name: element.name, isFolder: element.isDirectory()})
    })
    return myResult
    }).catch((err) =>{
        if (err.code == 'ENOTDIR'){
            return fs.readFile(path);
        }
        if (err.code == 'ENOENT'){
            throw new Error('le dossier néxiste pas')
        }
        })
}


function createFolder(dir, name){
    return fs.mkdir(path.join(dir, name)).then(()=>{
        console.log('Le dossier à bien été créé')
    }).catch((err)=>{
        console.log('Votre dossier na pas "été créé')
        if (err.code =='ENOENT'){
            throw new Error('Le dossier néxiste pas')
        }
    })
}

function deleteFolder(dir, name){
    return fs.rm(path.join(dir, name), {recursive: true}).then(()=> {
        console.log('Votre dossier ou fichier à bien été supprimé')
    }).catch((err) => {
        console.log('Impossible de supprimer votrer dossier ou fichier...')
        if (err.code == 'ENOENT'){
            throw new Error('Le dossier néxiste pas')
        }
    })
}

function addFile(name, dir, src){
    return fs.copyFile(src, path.join(dir, name)).then(() => {
        console.log('Votre fichier à bien été envoyé sur le drive')
    }).catch(() => {
        console.log('Votre fichier na pas été téléchargé...')
    })
}



module.exports = {
    createRootFolder: createRootFolder,
    listFolder: listFolder,
    createFolder: createFolder,
    deleteFolder: deleteFolder,
    addFile: addFile,
    ALPS_DRIVE: ALPS_DRIVE
}