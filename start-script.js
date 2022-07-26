#! /usr/bin/env node
const fs = require('fs')
const { dirname, resolve, join } = require('path');
const appDir = dirname(require.main.filename);
const node_modules_index = appDir.indexOf('node_modules');
const project_root = node_modules_index !== -1 ? appDir.substring(0, node_modules_index - 1) : appDir;
const reports_build_path = resolve(__dirname, './reports');
const build_files = fs.readdirSync(reports_build_path);
const config = require(`${project_root}\\ergconfig.json`);
var express = require("express");
var PORT = 5000

// Build exp log files
const exp_logs = fs.readdirSync(`${project_root}/${config.erg["experiment_logs_directory"]}`)
const vis_files = fs.readdirSync(`${project_root}/${config.erg["visualizations_directory"]}`)
let all_files = []
exp_logs.forEach(fn => {
    const re = /\d/
    const ob = re.exec(fn);
    let filesubstr = '';
    if (ob !== null && ob !== undefined) {
        filesubstr = fn.substring(0, ob.index + 15);
        visfn = vis_files.filter(x => x.includes(filesubstr))[0];
        if (visfn !== null && visfn !== undefined && visfn !== '') {
            obj = {
                'details_file': fn,
                'image_file': visfn
            }
            all_files.push(obj)
        }
    }
})

// preparing ergconfig
config['files_list'] = all_files;
fs.writeFileSync(`${project_root}\\ergconfig.json`, JSON.stringify(config));
    
// copy all files
console.log('\nCopying files to project root', project_root)
console.log('\tCopying ergconfig.json')
fs.copyFileSync(`${project_root}/ergconfig.json`, `${project_root}/reports/ergconfig.json`)

build_files.forEach(x => {
    if (x.includes('.') && x !== 'ergconfig.json') {
        console.log('\tCopying', x)
        fs.copyFileSync(`${reports_build_path}/${x}`, `${project_root}/reports/${x}`)
    } else if (x === 'images') {
        const image_assets = fs.readdirSync(`${reports_build_path}/images`);
        image_assets.forEach(y => {
            console.log('\tCopying', y)
            fs.copyFileSync(`${reports_build_path}/images/${y}`, `${project_root}/reports/images/${y}`)
        })
    }
});

// starting an express server
console.log('\nStating app server at port ', PORT)
var DIST_DIR = join(project_root, './reports')
var app = express();
app.use(express.static(DIST_DIR))

app.get('*', function(req, res) {
    res.sendFile(join(DIST_DIR, 'index.html'));
});

app.listen(PORT);