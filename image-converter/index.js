#!/usr/bin/env node
"use strict"

require("colors")
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const _ = require("lodash")
const { getAllFilesSync } = require("get-all-files")

const IMAGE_FORMATS = ["jpg", "jpeg", "png"]

const convert = (file, rootFolder) => {
	const newPath = convertFilename(file, rootFolder)

	const parentDir = path.dirname(newPath)
	fs.mkdirSync(parentDir, { recursive: true })

	sharp(file)
		.jpeg({ quality: 92 })
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

const convertFilename = (file, folderToUpdate) => {
	folderToUpdate = folderToUpdate ? _.trimEnd(folderToUpdate, "/") : ""
	const newDir = folderToUpdate + "__worked"

	let filePath = file.toString().replace(/(\.jp[e]?g|\.png)$/i, ".jpeg")
	if (folderToUpdate) {
		filePath = filePath.replace(folderToUpdate, newDir)
	}

	return filePath
}

const isImage = file_url => {
	const ext = _.split(file_url, ".").pop() || ""
	return IMAGE_FORMATS.includes(ext.toLowerCase())
}

// example: node index.js /Users/linko/Downloads/images [--create-folder]
if (process.argv.length >= 3) {
	console.log("")
	console.log("dir/file: ".green, process.argv[2].toString().yellow.bold)

	const createFolder = process.argv.length === 4 && process.argv[3] === "--create-folder"

	const files = getAllFilesSync(process.argv[2]).toArray()

	for (const file of files) {
		if (isImage(file)) {
			convert(file, createFolder ? process.argv[2] : false)
		}
	}
}
