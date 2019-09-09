const fs = require('fs')
const isValidPath = require('is-valid-path')
const { Transform } = require('stream')

const streamify = (input, options = {}) => {
	let outputStream

	switch (typeof input){
		case 'function':
			outputStream = new Transform({
				objectMode: true,
				...options,
				transform: (data, encoding, cb) => {
					try {
						data = input(data)

						cb(null, data)

					} catch (err) {
						cb(err)
					}
				}
			})
		break;

		case 'string':
			if (!isValidPath(input)) {
				throw TypeError(`Not Valid File Path`)
			}

			outputStream = fs.createReadStream(input, options)
		break;

		case 'object':

			if(Array.isArray(input)) {

				if (input[0] && typeof input[0] === 'string') {
					options.objectMode = false

				} else {
					options.objectMode = true
				}

				outputStream = new Transform({
					...options
				})

				for (const datum of input) {
					outputStream.push(datum)
				}
				outputStream.push(null)
			}
		break;
	}
	return outputStream
}

module.exports = streamify
