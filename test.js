const streamifyThis = require('./index.js')
const { Readable } = require('stream')

test(`streamifyThis(Function)`, () => {
	const result = []

	const addOne = (input) => {
		input.data ++

		return input
	}

	const functionStream = streamifyThis(addOne)

	const inputStream = new Readable({objectMode: true})

	inputStream.push({data: 0})
	inputStream.push({data: 2})
	inputStream.push({data: 3})
	inputStream.push(null)

	inputStream.pipe(functionStream)
	.on('data', (data) => {
		result.push(data)
	})
	.on('end', () => {
		expect(result).toEqual([
		{
			data: 1
		},
		{
			data: 3
		},
		{
			data: 4
		}
		])
	})
})

test(`streamifyThis(FilePath)`, () => {
	let result = ''
	const filePath = './fixtures.txt'
	const fileStream = streamifyThis(filePath)

	fileStream
	.on('data', (data) => {
		result = result + data
	})
	.on('end', () => {
		expect(result).toEqual('That’s what the world is, after all: an endless battle of contrasting memories.')
	})
})

test(`streamifyThis(Array)`, () => {
	let input = [
		{
			data: 1
		},
		{
			data: 3
		},
		{
			data: 4
		}
	]
	let result = []
	const fileStream = streamifyThis(input)

	fileStream
	.on('data', (data) => {
		result.push(data)
	})
	.on('end', () => {
		expect(result).toEqual(input)
	})
})