#!/usr/bin/env node
"use strict"

require("colors")
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const _ = require("lodash")
const { getAllFilesSync } = require("get-all-files")
const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

const argv = yargs(hideBin(process.argv)).argv

const IMAGE_FORMATS = ["jpg", "jpeg", "png"]

const convert = (file, rootFolder, format, quality) => {
	const newPath = convertFilename(file, rootFolder, format)

	const parentDir = path.dirname(newPath)
	fs.mkdirSync(parentDir, { recursive: true })

	sharp(file)
		[format]({ quality })
		.toFile(newPath)
		.then(info => {
			console.log("")
			console.log("╭─ " + file)
			console.log("╰─ " + newPath.toString().green)
		})
		.catch(err => {
			console.error(err)
		})
}

const convertFilename = (file, folderToUpdate, format) => {
	folderToUpdate = folderToUpdate ? _.trimEnd(folderToUpdate, "/") : ""
	const newDir = folderToUpdate + "__worked"

	let filePath = file.toString().replace(/(\.jp[e]?g|\.png|\.webp)$/i, "." + format)
	if (folderToUpdate) {
		filePath = filePath.replace(folderToUpdate, newDir)
	}

	return filePath
}

const isImage = file_url => {
	const ext = _.split(file_url, ".").pop() || ""
	return IMAGE_FORMATS.includes(ext.toLowerCase())
}

// example: node index.js /Users/linko/Downloads/images [--create-folder] [--format jpeg] [--quality 90]
if (process.argv.length >= 3) {
	console.log("")
	//console.log(argv)

	const rootPath = argv._[0]
	const createFolder = argv.createFolder
	const format = argv.format || "webp"
	const quality = argv.quality || 85

	console.log("dir/file: ".green, rootPath.toString().yellow.bold)

	const files = getAllFilesSync(rootPath).toArray()

	for (const file of files) {
		if (isImage(file)) {
			convert(file, createFolder ? rootPath : false, format, quality)
		}
	}
}
